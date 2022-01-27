import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {platform} from "../../lib/ava";
import chalk from "chalk";
import Table from "cli-table";

export const command = "validates [args]";

export const desc = "Get the IDs of the blockchains a Subnet validates.";

export const builder = (yargs: Argv) =>
    yargs.options({
        subnetID: {
            alias: "s",
            description: "Subnet ID",
            required: true
        }
    });

export async function handler(args: ArgShape) {
    const {data} = await platform.validates(args);

    if (data?.blockchainIDs) {
        const listTable = new Table({
            head: ["blockchainIDs"],
        });
        data.blockchainIDs.forEach((blockchain: string) => {
            listTable.push([blockchain]);
        });
        console.log(`${listTable}`);
    } else {
        console.log(`${chalk.red('Error getting validators list!')}`);
        console.error('Reason:', data.error.message);
    }
}
