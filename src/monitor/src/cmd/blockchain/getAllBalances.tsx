import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {avm} from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import Table from "cli-table";

export const command = "getAllBalances [args]";

export const desc = "Get the balances of all assets controlled by a given address.";

export const builder = (yargs: Argv) =>
    yargs.options({
        address: {
            alias: "a",
            description: "Address of the account",
            required: true
        }
    });

export async function handler(args: ArgShape) {
    const {data} = await avm.getAllBalances(args);

    if (data?.balances) {
        clear();
        console.log(
            chalk.yellow(figlet.textSync("Balances", { horizontalLayout: "full" }))
        );
        const listTable = new Table({
            head: ["Asset", "Balance"],
        });
        data.balances.forEach((balance: any) => {
            listTable.push([balance.asset, balance.balance]);
        })
        console.log(listTable.toString());
    } else {
        console.log(`${chalk.red('Error getting all balances!')}`);
        console.error('Reason:', data.error.message);
    }
}
