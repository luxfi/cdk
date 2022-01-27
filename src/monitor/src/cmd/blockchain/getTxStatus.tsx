import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {avm, platform} from "../../lib/ava";
import chalk from "chalk";

export const command = "getTxStatus [args]";

export const desc = "Get transaction status.";

export const builder = (yargs: Argv) =>
    yargs.options({
        txID: {
            alias: "t",
            description: "Transaction ID",
            required: true
        }
    }).middleware((args) => {
        if (!args.chain || args.chain === "") args.chain = "P";
        if (args.chain === "C") throw new Error('Chain should be P or X');

        return args;
    });

export async function handler(args: ArgShape) {
    const {chain} = args;
    let func = platform.getTxStatus;
    if (chain === "X") func = avm.getTxStatus;

    const {data} = await func(args);

    if (data?.status) {
        console.log(`${chalk.green('Transaction Status: ')} ${data.status}`);
    } else {
        console.log(`${chalk.red('Error getting transaction status!')}`);
        console.error('Reason:', data.error.message);
    }
}
