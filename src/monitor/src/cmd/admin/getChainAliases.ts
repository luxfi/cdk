import {Argv} from "yargs";
import {ArgShape} from "../../cli";
import {admin} from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import Table from "cli-table";

export const command = "getChainAliases [args]";

export const desc = "Returns the aliases of the chain.";

export const builder = (yargs: Argv) =>
    yargs.options({
        chain: {
            alias: "c",
            description: "Blockchain ID.",
            required: true
        }
    });

export async function handler(args: ArgShape) {
    const {data} = await admin.getChainAliases(args);
    if (data?.aliases?.length) {
        clear();
        console.log(
            chalk.yellow(figlet.textSync("Aliases", { horizontalLayout: "full" }))
        );
        const aliasesTable = new Table({
            head: ["Alias"],
        });
        data.aliases.map((alias: string) => {
            aliasesTable.push([alias]);
        });
        console.log(aliasesTable.toString());
    } else {
        console.log(`${chalk.red('Error getting aliases for this chain!')}`);
        console.error('Reason:', data.error.message);
    }
}
