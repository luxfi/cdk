import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {avax} from "../../lib/ava";
import chalk from "chalk";

export const command = "getAtomicTx [args]";

export const desc = "Get a transaction by ID.";

export const builder = (yargs: Argv) =>
    yargs.options({
        txID: {
            alias: "t",
            description: "Transaction ID",
            required: true
        },
        encoding: {
            alias: "e",
            description: "encoding",
            choices: ["cb58", "hex", "json"]
        }
    });

export async function handler(args: ArgShape) {
    const {data} = await avax.getAtomicTx(args);

    if (data?.tx) {
        console.log(`${chalk.green('Transaction: ')} ${data.tx}`);
        console.log(`${chalk.green('encoding: ')} ${data.encoding}`);
        console.log(`${chalk.green('blockHeight: ')} ${data.blockHeight}`);
    } else {
        console.log(`${chalk.red('Error getting a transaction!')}`);
        console.error('Reason:', data.error.message);
    }
}
