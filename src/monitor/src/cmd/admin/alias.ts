import {Argv} from "yargs";
import {ArgShape} from "../../cli";
import {admin} from "../../lib/ava";
import chalk from "chalk";

export const command = "alias [args]";

export const desc = "Assign an API endpoint an alias, a different endpoint for the API";

export const builder = (yargs: Argv) =>
    yargs.options({
        endpoint: {
            alias: "e",
            description: "Original endpoint of the API.",
            required: true
        },
        alias: {
            alias: "a",
            description: "New Alias for the endpoint.",
            required: true,
        }
    });

export async function handler(args: ArgShape) {
    const {data} = await admin.alias(args);
    if (data.success) {
        console.log(`${chalk.green('Alias created successfully!')}`);
    } else {
        console.log(`${chalk.red('Error creating new alias!')}`);
        console.error('Reason:', data.error.message);
    }
}
