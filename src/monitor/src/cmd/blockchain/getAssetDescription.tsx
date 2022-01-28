import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {avm} from "../../lib/ava";
import chalk from "chalk";

export const command = "getAssetDescription [args]";

export const desc = "Get information about an asset.";

export const builder = (yargs: Argv) =>
    yargs.options({
        assetID: {
            alias: "a",
            description: "Asset ID",
            required: true
        }
    });

export async function handler(args: ArgShape) {
    const {data} = await avm.getAssetDescription(args);

    if (data?.assetId) {
        console.log(`${chalk.green('assetId: ')} ${data.assetId}`);
        console.log(`${chalk.green('name: ')} ${data.name}`);
        console.log(`${chalk.green('symbol: ')} ${data.symbol}`);
        console.log(`${chalk.green('denomination: ')} ${data.denomination}`);
    } else {
        console.log(`${chalk.red('Error minting asset!')}`);
        console.error('Reason:', data.error.message);
    }
}
