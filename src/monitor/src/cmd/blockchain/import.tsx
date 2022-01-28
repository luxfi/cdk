import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {avax, avm, platform} from "../../lib/ava";
import chalk from "chalk";

export const command = "import [args]";

export const desc = "Finalize a transfer of an asset.";

export const builder = (yargs: Argv) =>
    yargs.options({
        to: {
            alias: "t",
            description: "Address AVAX is imported to",
            required: true
        },
        username: {
            alias: "u",
            description: "Username of the user",
            required: true
        },
        password: {
            alias: "p",
            description: "Password of the user",
            required: true
        },
        sourceChain: {
            alias: "s",
            description: "Source of the asset imported from. Required in case of chain C and X."
        },
        baseFee: {
            alias: "b",
            description: "Based fee that should be used.",
            type: "number"
        },
        changeAddr: {
            alias: "ca",
            description: "Address any change will be sent to."
        },
        from: {
            alias: "f",
            description: "Addresses should be use for this import.",
            type: "array"
        }
    }).middleware((args) => {
        if (!args.chain || args.chain === "") args.chain = "P";

        // @ts-ignore
        if (["X", "C"].includes(args.chain)) {
            delete args.changeAddr;
            delete args.from;
            if (!args.sourceChain || args.sourceChain === args.chain)
                throw new Error('Please provide a valid value for sourceChain');
        }

        if (args.chain === "X") {
            delete args.baseFee;
        } else if (args.chain === "P") {
            delete args.baseFee;
            delete args.sourceChain;
        }

        return args;
    });

export async function handler(args: ArgShape) {
    const {chain} = args;
    let func = platform.importAVAX;
    if (chain === "X") func = avm.import;
    else if (chain === "C") func = avax.import;

    const {data} = await func(args);

    if (data?.txID) {
        console.log(`${chalk.green('Transaction ID: ')} ${data.txID}`);
        if (chain === "P") console.log(`${chalk.green('changeAddr: ')} ${data.changeAddr}`);
    } else {
        console.log(`${chalk.red('Error importing transaction!')}`);
        console.error('Reason:', data.error.message);
    }
}
