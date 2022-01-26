import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {platform} from "../../lib/ava";
import chalk from "chalk";

export const command = "getCurrentValidators [args]";

export const desc = "List the current validators.";

export const builder = (yargs: Argv) =>
    yargs.options({
      subnetID: {
        alias: "s",
        describe: "Subnet id"
      },
      nodeIDs: {
        alias: "n",
        describe: "List of nod ids.",
        type: "array"
      },
    });

export async function handler(args: ArgShape) {
  const {data} = await platform.getCurrentValidators(args);

  if (data && data.validators) {
    console.log(data.validators);
  } else {
    console.log(`${chalk.red('Error getting blockchain current supply!')}`);
    console.error('Reason:', data.error.message);
  }
}
