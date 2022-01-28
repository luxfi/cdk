import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {wallet} from "../../lib/ava";
import chalk from "chalk";

export const command = "send [args]";

export const desc = "Send a quantity of an asset to an address and assume the tx will be accepted so that future calls can use the modified UTXO set.";

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
            description: "Asset ID",
            required: true,
            type: "string"
        },
        memo: {
            description: "Attach a memo",
            type: "string"
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
    });

export async function handler(args: ArgShape) {
    const {data} = await wallet.send(args);

    if (data && data.txID) {
        console.log(`${chalk.green('txID: ')} ${data.txID}`);
        console.log(`${chalk.green('changeAddr: ')} ${data.changeAddr}`);
    } else {
        console.log(`${chalk.red('Error sending asset!')}`);
        console.error('Reason:', data.error.message);
    }
}
