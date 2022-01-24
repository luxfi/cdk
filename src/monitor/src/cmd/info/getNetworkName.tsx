import {Argv} from "yargs";
import {ArgShape} from "../../cli";
import {info} from "../../lib/ava";
import chalk from "chalk";

export const command = "getNetworkName [args]";

export const desc = "Get the name of the network this node is participating in.";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
    const {data} = await info.getNetworkName(args);
    if (data.networkName) {
        console.log(`${chalk.green('networkName: ')} ${data.networkName}`);
    } else {
        console.log(`${chalk.red('Error getting network name!')}`);
        console.error('Reason:', data.error.message);
    }
}
