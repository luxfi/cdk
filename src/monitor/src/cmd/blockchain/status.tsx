import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {platform} from "../../lib/ava";
import chalk from "chalk";

export const command = "status [args]";

export const desc = "Get the status of blockchain";

export const builder = (yargs: Argv) =>
    yargs.options({
      blockchainID: {
        alias: "b",
        description: "Blockchain ID",
        required: true
      }});

export async function handler(args: ArgShape) {
  const {data} = await platform.getBlockchainStatus(args);

  if (data && data.status) {
    console.log(`${chalk.green('Status: ')} ${data.status}`);
  } else {
    console.log(`${chalk.red('Error getting blockchain status!')}`);
    console.error('Reason:', data.error.message);
  }
}
