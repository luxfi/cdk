import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {avax, avm, platform} from "../../lib/ava";
import chalk from "chalk";

export const command = "issueTx [args]";

export const desc = "Send a signed transaction to the network.";

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
    }).middleware((args) => {
        if (!args.chain || args.chain === "") args.chain = "P";

        return args;
    });

export async function handler(args: ArgShape) {
    const {chain} = args;
    let func = platform.issueTx;
    if (chain === "X") func = avm.issueTx;
    else if (chain === "C") func = avax.issueTx;

    const {data} = await func(args);

    if (data?.txID) {
        console.log(`${chalk.green('Transaction ID: ')} ${data.txID}`);
    } else {
        console.log(`${chalk.red('Error issuing transaction!')}`);
        console.error('Reason:', data.error.message);
    }
}
