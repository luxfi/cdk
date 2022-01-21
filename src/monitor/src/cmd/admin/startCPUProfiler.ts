import {Argv} from "yargs";
import {ArgShape} from "../../cli";
import {admin} from "../../lib/ava";
import chalk from "chalk";

export const command = "startCPUProfiler [args]";

export const desc = "Start profiling the CPU utilization of the node.";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
    const {data} = await admin.startCPUProfiler(args);
    if (data.success) {
        console.log(`${chalk.green('Operation performed successfully!')}`);
    } else {
        console.log(`${chalk.red('Error performing startCPUProfiler!')}`);
        console.error('Reason:', data.error.message);
    }
}
