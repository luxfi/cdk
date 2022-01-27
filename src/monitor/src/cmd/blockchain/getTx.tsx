import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {avm, platform} from "../../lib/ava";
import chalk from "chalk";

export const command = "getTx [args]";

export const desc = "Get transaction.";

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
    }).middleware((args) => {
        if (!args.chain || args.chain === "") args.chain = "P";
        if (args.chain === "C") throw new Error('Chain should be P or X');

        if (!args.encoding || args.encoding === "") args.encoding = args.chain === "P" ? "cb58" : "json";
        if (args.chain === "P" && args.encoding === "json") throw new Error('Chain P doesnt support encoding json');

        return args;
    });

export async function handler(args: ArgShape) {
    const {chain} = args;
    let func = platform.getTx;
    if (chain === "X") func = avm.getTx;

    const {data} = await func(args);

    if (data?.tx) {
        console.log(`${chalk.green('Transaction: ')} ${data.tx}`);
    } else {
        console.log(`${chalk.red('Error getting transaction!')}`);
        console.error('Reason:', data.error.message);
    }
}
