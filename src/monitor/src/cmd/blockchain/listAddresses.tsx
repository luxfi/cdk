import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {platform} from "../../lib/ava";
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
    });

export async function handler(args: ArgShape) {
  const {data} = await platform.listAddresses(args);

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
