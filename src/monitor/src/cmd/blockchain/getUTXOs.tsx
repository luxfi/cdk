import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {avax, avm, platform} from "../../lib/ava";
import chalk from "chalk";

export const command = "getUTXOs [args]";

export const desc = "Gets the UTXOs that reference a given address.";

export const builder = (yargs: Argv) =>
    yargs.options({
        addresses: {
            alias: "a",
            description: "Array of addresses",
            required: true,
            type: "array",
            help: "Use spaces to separate address and use -- to stop adding values"
        },
        limit: {
            description: "Number of UTXOs to be returned.",
            type: "number"
        },
        encoding: {
            alias: "e",
            description: "encoding",
            choices: ["cb58", "hex"],
            default: "cb58"
        },
        startIndexAddress: {
            alias: "sa",
            description: "Start index address."
        },
        startIndexUTXO: {
            alias: "su",
            description: "Start index UTXO."
        },
    }).middleware((args) => {
        if (!args.chain || args.chain === "") args.chain = "P";

        return args;
    });

export async function handler(args: ArgShape) {
    const {chain} = args;
    let func = platform.getUTXOs;
    if (chain === "X") func = avm.getUTXOs;
    else if (chain === "C") func = avax.getUTXOs;

    const {data} = await func(args);

    if (data?.utxos) {
        console.log(`${chalk.green('numFetched: ')} ${data.numFetched}`);
        console.log(`${chalk.green('utxos: ')} ${data.utxos}`);
        console.log(`${chalk.green('endIndex: ')} ${data.endIndex}`);
    } else {
        console.log(`${chalk.red('Error getting UTXOs!')}`);
        console.error('Reason:', data.error.message);
    }
}
