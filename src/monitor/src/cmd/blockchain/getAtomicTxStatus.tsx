import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {avax} from "../../lib/ava";
import chalk from "chalk";

export const command = "getAtomicTxStatus [args]";

export const desc = "Get the status of an atomic transaction sent to the network.";

export const builder = (yargs: Argv) =>
    yargs.options({
        txID: {
            alias: "t",
            description: "Transaction ID",
            required: true
        }
    })

export async function handler(args: ArgShape) {
    const {data} = await avax.getAtomicTxStatus(args);

    if (data?.status) {
        console.log(`${chalk.green('Transaction Status: ')} ${data.status}`);
        console.log(`${chalk.green('Transaction blockHeight: ')} ${data.blockHeight}`);
    } else {
        console.log(`${chalk.red('Error getting transaction status!')}`);
        console.error('Reason:', data.error.message);
    }
}
