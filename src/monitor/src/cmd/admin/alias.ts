import {Argv} from "yargs";
import {ArgShape} from "../../cli";
import {admin} from "../../lib/ava";

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
        console.log(`Alias created successfully!`);
    } else {
        console.error(`Error creating new alias`, data.error.message);
    }
}
