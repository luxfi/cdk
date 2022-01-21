import {Argv} from "yargs";
import {ArgShape} from "../../cli";
import {admin} from "../../lib/ava";
import chalk from "chalk";

export const command = "aliasChain [args]";

export const desc = "Assign a different name that can be used any place the blockchain’s ID is used.";

export const builder = (yargs: Argv) =>
    yargs.options({
        chain: {
            alias: "c",
            description: "Blockchain ID.",
            required: true
        },
        alias: {
            alias: "a",
            description: "Alias for the blockchain id.",
            required: true,
        }
    });

export async function handler(args: ArgShape) {
    const {data} = await admin.aliasChain(args);
    if (data.success) {
        console.log(`${chalk.green('Alias for blockchain created successfully!')}`);
    } else {
        console.log(`${chalk.red('Error creating new alias for blockchain!')}`);
        console.error('Reason:', data.error.message);
    }
}
