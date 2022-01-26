import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {platform} from "../../lib/ava";
import chalk from "chalk";

export const command = "getTimestamp [args]";

export const desc = "Get the timestamp of blockchain";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
  const {data} = await platform.getTimestamp(args);

  if (data?.timestamp) {
    console.log(`${chalk.green('Timestamp: ')} ${data.timestamp}`);
  } else {
    console.log(`${chalk.red('Error getting timestamp!')}`);
    console.error('Reason:', data.error.message);
  }
}
