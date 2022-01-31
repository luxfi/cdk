import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {avm} from "../../lib/ava";
import chalk from "chalk";

export const command = "send [args]";

export const desc = "Send a quantity of an asset to an address.";

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
        assetID: {
            description: "Attach a memo.",
            required: true
        },
        memo: {
            description: "Attach a memo."
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
    const {data} = await avm.send(args);

    if (data?.txID) {
        console.log(`${chalk.green('txID: ')} ${data.txID}`);
        console.log(`${chalk.green('changeAddr: ')} ${data.changeAddr}`);
    } else {
        console.log(`${chalk.red('Error sending asset!')}`);
        console.error('Reason:', data.error.message);
    }
}
