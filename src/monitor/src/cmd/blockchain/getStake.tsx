import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {platform} from "../../lib/ava";
import chalk from "chalk";

export const command = "getStake [args]";

export const desc = "Get the amount of nAVAX staked by a set of addresses.";

export const builder = (yargs: Argv) =>
    yargs.options({
      addresses: {
        alias: "a",
        description: "Address",
        type: "array",
        required: true,
        help: "Use spaces to separate address and use -- to stop adding values"
      }});

export async function handler(args: ArgShape) {
  const {data} = await platform.getStake(args);

  if (data?.staked) {
    console.log(`${chalk.green('Staked: ')} ${data.staked}`);
  } else {
    console.log(`${chalk.red('Error getting stake of addresses!')}`);
    console.error('Reason:', data.error.message);
  }
}
