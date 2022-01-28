import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {avm} from "../../lib/ava";
import chalk from "chalk";
import Table from "cli-table";

export const command = "getAddressTxs [args]";

export const desc = "Get all transactions of an address.";

export const builder = (yargs: Argv) =>
    yargs.options({
        address: {
            alias: "a",
            description: "Address of the account",
            required: true
        },
        assetID: {
            alias: "ai",
            description: "Asset ID",
            required: true
        },
        cursor: {
            alias: "c",
            description: "Offset",
            type: "number"
        },
        pageSize: {
            alias: "p",
            description: "Result to return",
            type: "number",
            default: 1024,
        }
    });

export async function handler(args: ArgShape) {
    const {data} = await avm.getAddressTxs(args);

    if (data?.txIDs) {
        const listTable = new Table({
            head: ["Transaction IDs"],
        });
        data.txIDs.forEach((tx: string) => {
            listTable.push([tx]);
        })
        console.log(`${listTable.toString()}`);
    } else {
        console.log(`${chalk.red('Error getting transactions!')}`);
        console.error('Reason:', data.error.message);
    }
}
