import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {avm} from "../../lib/ava";
import chalk from "chalk";

export const command = "mintNFT [args]";

export const desc = "Mint non-fungible tokens which were created with avm.createNFTAsset.";

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
        assetID: {
            alias: 'a',
            description: "Asset ID of the newly created NFT",
            required: true,
            type: "string"
        },
        to: {
            description: "Transfer to address",
            required: true,
            type: "string"
        },
        payload: {
            description: "Arbitrary payload.",
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
    const {data} = await avm.mintNFT(args);

    if (data?.txID) {
        console.log(`${chalk.green('txID: ')} ${data.txID}`);
        console.log(`${chalk.green('changeAddr: ')} ${data.changeAddr}`);
    } else {
        console.log(`${chalk.red('Error minting NFT!')}`);
        console.error('Reason:', data.error.message);
    }
}
