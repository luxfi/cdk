import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {platform} from "../../lib/ava";
import chalk from "chalk";

export const command = "getHeight [args]";

export const desc = "Get height of last accepted block.";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
  const {data} = await platform.getHeight(args);

  if (data && data.height) {
    console.log(`${chalk.green('Height: ')} ${data.height}`);
  } else {
    console.log(`${chalk.red('Error getting height of block!')}`);
    console.error('Reason:', data.error.message);
  }
}
