
import {Argv} from "yargs";
import {ArgShape} from "../../cli";
import {admin} from "../../lib/ava";
import chalk from "chalk";

export const command = "stopCPUProfiler [args]";

export const desc = "Stop the CPU profile that was previously started.";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
    const {data} = await admin.stopCPUProfiler(args);
    if (data.success) {
        console.log(`${chalk.green('Operation performed successfully!')}`);
    } else {
        console.log(`${chalk.red('Error performing stopCPUProfiler!')}`);
        console.error('Reason:', data.error.message);
    }
}
