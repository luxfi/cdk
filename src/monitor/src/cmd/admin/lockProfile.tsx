import {Argv} from "yargs";
import {ArgShape} from "../../cli";
import {admin} from "../../lib/ava";
import chalk from "chalk";

export const command = "lockProfile [args]";

export const desc = "Writes a profile of mutex statistics to lock.profile.";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
    const {data} = await admin.lockProfile(args);
    if (data.success) {
        console.log(`${chalk.green('Operation performed successfully!')}`);
    } else {
        console.log(`${chalk.red('Error performing lockProfile!')}`);
        console.error('Reason:', data.error.message);
    }
}
