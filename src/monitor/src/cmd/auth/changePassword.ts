import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { auth } from "../../lib/ava";
import chalk from "chalk";

export const command = "changePassword [args]";

export const desc = "Change password for current authorization token.";

export const builder = (yargs: Argv) =>
    yargs.options({
        oldPassword: {
            alias: "op",
            description: "Old authorization token password",
            required: true,
        },
        newPassword: {
            alias: "-np",
            description: "New authorization token password.",
            required: true,
        },
    });

export async function handler(args: ArgShape) {
    const {data} = await auth.changePassword(args);
    if (data.token) {
        console.log(`${chalk.blue("Authorization token password changed successfully!")}`);
    } else {
        console.error(`${chalk.red("Unable to change authorization token password.")}`, data.error.message);
    }
}
