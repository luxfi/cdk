import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { auth } from "../../lib/ava";
import chalk from "chalk";

export const command = "revokeToken [args]";

export const desc = "Revoke a previously generated token.";

export const builder = (yargs: Argv) =>
    yargs.options({
        password: {
            alias: "p",
            description: "node authorization token password",
            required: true,
        },
        token: {
            required: true,
            alias: "-ot",
            description: "Previously generated token.",
        },
    });

export async function handler(args: ArgShape) {
    const {data} = await auth.revokeToken(args);
    if (data.token) {
        console.log(`${chalk.blue("Token revoked successfully!")}`);
    } else {
        console.error(`${chalk.red("Error revoking access of the token")}`, data.error.message);
    }
}
