import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {platform} from "../../lib/ava";
import chalk from "chalk";

export const command = "getCurrentSupply [args]";

export const desc = "Get maximum number of AVAX exists";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
  const {data} = await platform.getCurrentSupply(args);

  if (data && data.supply) {
    console.log(`${chalk.green('Supply: ')} ${data.supply}`);
  } else {
    console.log(`${chalk.red('Error getting blockchain current supply!')}`);
    console.error('Reason:', data.error.message);
  }
}
