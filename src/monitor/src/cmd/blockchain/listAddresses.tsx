import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {platform, avm} from "../../lib/ava";
import chalk from "chalk";
import Table from "cli-table";

export const command = "listAddresses [args]";

export const desc = "List addresses controlled by the given user.";

export const builder = (yargs: Argv) =>
    yargs.options({
        username: {
            alias: "u",
            description: "Username of the user",
            required: true
        },
        password: {
            alias: "p",
            description: "Password of the user",
            required: true
        },
    }).middleware((args) => {
        if (!args.chain || args.chain === "") args.chain = "P";
        if (args.chain === "C") throw new Error('Chain should be P or X');

        return args;
    });

export async function handler(args: ArgShape) {
    const {chain} = args;
    let func = platform.listAddresses;
    if (chain === "X") func = avm.listAddresses;

    const {data} = await func(args);

    if (data?.addresses) {
        const listTable = new Table({
            head: ["Address"],
        });
        data.addresses.forEach((address: string) => {
            listTable.push([address]);
        })
        console.log(`${chalk.green('Addresses: ')}`);
        console.log(`${listTable}`);
    } else {
        console.log(`${chalk.red('Error getting addresses list!')}`);
        console.error('Reason:', data.error.message);
    }
}
