import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {avm} from "../../lib/ava";
import chalk from "chalk";

export const command = "sendNFT [args]";

export const desc = "Send a non-fungible token.";

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
        groupID: {
            description: "NFT group from which to send the NFT",
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
    const {data} = await avm.sendNFT(args);

    if (data?.txID) {
        console.log(`${chalk.green('txID: ')} ${data.txID}`);
        console.log(`${chalk.green('changeAddr: ')} ${data.changeAddr}`);
    } else {
        console.log(`${chalk.red('Error sending NFT!')}`);
        console.error('Reason:', data.error.message);
    }
}
