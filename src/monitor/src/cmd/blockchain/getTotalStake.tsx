import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {platform} from "../../lib/ava";
import chalk from "chalk";

export const command = "getTotalStake [args]";

export const desc = "Get the total amount of nAVAX staked on the Primary Network.";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
  const {data} = await platform.getTotalStake(args);

  if (data?.stake) {
    console.log(`${chalk.green('Total Stake: ')} ${data.stake}`);
  } else {
    console.log(`${chalk.red('Error getting total stake!')}`);
    console.error('Reason:', data.error.message);
  }
}
