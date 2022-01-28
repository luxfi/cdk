import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {avm} from "../../lib/ava";
import chalk from "chalk";

export const command = "mint [args]";

export const desc = "Mint units of a variable-cap asset created with avm.createVariableCapAsset.";

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
    const {data} = await avm.mint(args);

    if (data?.txID) {
        console.log(`${chalk.green('txID: ')} ${data.txID}`);
        console.log(`${chalk.green('changeAddr: ')} ${data.changeAddr}`);
    } else {
        console.log(`${chalk.red('Error sending asset!')}`);
        console.error('Reason:', data.error.message);
    }
}
