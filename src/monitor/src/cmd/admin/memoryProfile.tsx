import {Argv} from "yargs";
import {ArgShape} from "../../cli";
import {admin} from "../../lib/ava";
import chalk from "chalk";

export const command = "memoryProfile [args]";

export const desc = "Writes a memory profile of the to mem.profile.";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
    const {data} = await admin.memoryProfile(args);
    if (data.success) {
        console.log(`${chalk.green('Operation performed successfully!')}`);
    } else {
        console.log(`${chalk.red('Error performing memoryProfile!')}`);
        console.error('Reason:', data.error.message);
    }
}
