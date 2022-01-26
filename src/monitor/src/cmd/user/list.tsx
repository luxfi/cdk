import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { keystore } from "../../lib/ava";
import chalk from "chalk";

export const command = "list [args]";

export const desc = "List users";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
  console.log(`Listing users of the blockchain`);
  const resp = await keystore.listUsers();

  if (resp.data?.users?.length) {
    for(const user of resp.data.users) {
      console.log(`- ${user}`);
    }
  } else if (resp.data?.users?.length === 0) {
    console.log(`${chalk.red("No user exists!")}`);
  } else {
    console.log(`${chalk.red("Error listing users")}: ${resp.data}`, resp);
  }
}
