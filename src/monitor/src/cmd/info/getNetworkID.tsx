import {Argv} from "yargs";
import {ArgShape} from "../../cli";
import {info} from "../../lib/ava";
import chalk from "chalk";

export const command = "getNetworkID [args]";

export const desc = "Get the ID of the network this node is participating in.";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
    const {data} = await info.getNetworkID(args);
    if (data.networkID) {
        console.log(`${chalk.green('NetworkID: ')} ${data.networkID}`);
    } else {
        console.log(`${chalk.red('Error getting network ID!')}`);
        console.error('Reason:', data.error.message);
    }
}
