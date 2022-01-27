import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {platform} from "../../lib/ava";
import chalk from "chalk";
import Table from "cli-table";

export const command = "sampleValidators [args]";

export const desc = "Sample validators from the specified Subnet.";

export const builder = (yargs: Argv) =>
    yargs.options({
        size: {
            description: "Number of validators to sample",
            required: true,
            type: "number"
        },
        subnetID: {
            alias: "s",
            description: "Subnet to sampled from"
        },
    });

export async function handler(args: ArgShape) {
    const {data} = await platform.sampleValidators(args);

    if (data?.validators) {
        const listTable = new Table({
            head: ["Validators"],
        });
        data.validators.forEach((validator: string) => {
            listTable.push([validator]);
        })
        console.log(`${listTable}`);
    } else {
        console.log(`${chalk.red('Error getting validators list!')}`);
        console.error('Reason:', data.error.message);
    }
}
