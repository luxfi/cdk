import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../../lib/kube";
import { keystore } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "list [args]";

export const desc = "List users";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
  const username = args.username;
  const password = args.password || generatePassword();

  console.log(
    `Listing users ${chalk.yellow(username)} with ${chalk.yellow(
      password
    )} to the blockchain`
  );

  const resp = await keystore.listUsers();
  if (resp.data.users) {
    resp.data.users.map((username: string) => {
      console.log(`- ${username}`);
    });
  } else {
    console.log(`${chalk.red("Error listing users")}: ${resp.data}`);
  }
}
