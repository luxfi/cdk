import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {avax, avm, platform} from "../../lib/ava";
import chalk from "chalk";

export const command = "export [args]";

export const desc = "Send AVAX from an address on the from one chain to another.";

export const builder = (yargs: Argv) =>
    yargs.options({
        username: {
            alias: "u",
            description: "Username for the key",
            required: true,
            help: "Username for the key",
        },
        password: {
            alias: "p",
            description: "Password for the key",
            required: true,
        },
        amount: {
            description: "Amount to transfer",
            required: true,
            type: "number"
        },
        to: {
            description: "Transfer to address",
            required: true,
            type: "string"
        },
        baseFee: {
            description: "Base fee to be used for creating the transaction",
            type: "number"
        },
        changeAddr: {
            description: "Address to send any change",
            type: "string"
        },
        from: {
            description: "Address to send any change",
            type: "array",
            help: "Use spaces to separate address and use -- to stop adding values"
        },
    }).middleware((args) => {
        if (!args.chain || args.chain === "") args.chain = "P";

        if (args.chain === "C") {
            delete args.from;
            delete args.changeAddr;
        } else {
            delete args.baseFee;
        }

        return args;
    });

export async function handler(args: ArgShape) {
    const {chain} = args;
    let func = platform.exportAVAX;
    if (chain === "C") func = avax.export;
    else if (chain === "X") func = avm.export;

    const {data} = await func(args);

    if (data && data.txID) {
        console.log(`${chalk.green('txID: ')} ${data.txID}`);

        if (chain !== "C")
        console.log(`${chalk.green('changeAddr: ')} ${data.changeAddr}`);
    } else {
        console.log(`${chalk.red('Error exporting AVAX!')}`);
        console.error('Reason:', data.error.message);
    }
}
