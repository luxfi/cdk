import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {wallet} from "../../lib/ava";
import chalk from "chalk";

export const command = "issueTx [args]";

export const desc = "Send a signed transaction to the network and assume the tx will be accepted.";

export const builder = (yargs: Argv) =>
    yargs.options({
        tx: {
            alias: "t",
            description: "Transaction",
            required: true
        },
        encoding: {
            alias: "e",
            description: "Encoding format",
            choices: ["cb58", "hex"],
            default: "cb58"
        }
    });

export async function handler(args: ArgShape) {
    const {data} = await wallet.issueTx(args);

    if (data?.txID) {
        console.log(`${chalk.green('Transaction ID: ')} ${data.txID}`);
    } else {
        console.log(`${chalk.red('Error issuing transaction!')}`);
        console.error('Reason:', data.error.message);
    }
}
