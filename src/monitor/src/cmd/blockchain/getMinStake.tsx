import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {platform} from "../../lib/ava";
import chalk from "chalk";

export const command = "getMinStake [args]";

export const desc = "Get the minimum amount of AVAX required to validate the Primary Network and the minimum amount of AVAX that can be delegated.";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
  const {data} = await platform.getMinStake(args);

  if (data?.minValidatorStake) {
    console.log(`${chalk.green('minValidatorStake: ')} ${data.minValidatorStake}`);
    console.log(`${chalk.green('minDelegatorStake: ')} ${data.minDelegatorStake}`);
  } else {
    console.log(`${chalk.red('Error getting min stake!')}`);
    console.error('Reason:', data.error.message);
  }
}
