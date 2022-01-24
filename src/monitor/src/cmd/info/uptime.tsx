import {Argv} from "yargs";
import {ArgShape} from "../../cli";
import {info} from "../../lib/ava";
import chalk from "chalk";

export const command = "uptime [args]";

export const desc = "Network's observed uptime of node.";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
    const {data} = await info.uptime(args);
    if (data.rewardingStakePercentage || data.weightedAveragePercentage) {
        console.log(`${chalk.green('rewardingStakePercentage: ')} ${data.rewardingStakePercentage}`);
        console.log(`${chalk.green('weightedAveragePercentage: ')} ${data.weightedAveragePercentage}`);
    } else {
        console.log(`${chalk.red('Error getting network uptime!')}`);
        console.error('Reason:', data.error.message);
    }
}
