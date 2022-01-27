import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {platform} from "../../lib/ava";
import chalk from "chalk";

export const command = "validatedBy [args]";

export const desc = "Get the Subnet that validates a given blockchain.";

export const builder = (yargs: Argv) =>
    yargs.options({
        blockchainID: {
            alias: "b",
            description: "Blockchain ID",
            type: "string",
            required: true
        }
    });

export async function handler(args: ArgShape) {
    const {data} = await platform.validatedBy(args);

    if (data?.subnetID) {
        console.log(`${chalk.green('Subnet ID: ')} ${data.subnetID}`);
    } else {
        console.log(`${chalk.red('Error getting subnetID!')}`);
        console.error('Reason:', data.error.message);
    }
}
