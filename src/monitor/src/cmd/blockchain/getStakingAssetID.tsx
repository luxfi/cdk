import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {platform} from "../../lib/ava";
import chalk from "chalk";

export const command = "getStakingAssetID [args]";

export const desc = "Get an assetID for a subnet’s staking asset";

export const builder = (yargs: Argv) =>
    yargs.options({
      subnetID: {
        alias: "s",
        description: "Subnet ID"
      }});

export async function handler(args: ArgShape) {
  const {data} = await platform.getStakingAssetID(args);

  if (data?.assetID) {
    console.log(`${chalk.green('Asset ID: ')} ${data.assetID}`);
  } else {
    console.log(`${chalk.red('Error getting staking asset ID!')}`);
    console.error('Reason:', data.error.message);
  }
}
