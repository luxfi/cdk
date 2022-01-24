import { Argv } from "yargs";
import { ArgShape } from "@cli";
import {metrics} from "../lib/ava";
import chalk from "chalk";

export const command = "metrics [args]";

export const desc = "Get node health and performance stats.";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
    const {data} = await metrics(args);
    console.log(data);
    if (data.networkName) {
        console.log(`${chalk.green('networkName: ')} ${data.networkName}`);
    } else {
        console.log(`${chalk.red('Error getting network name!')}`);
        console.error('Reason:', data.error.message);
    }
}
