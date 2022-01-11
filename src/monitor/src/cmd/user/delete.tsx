import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../../lib/kube";
import { keystore } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "delete [args]";

export const desc = "Delete an existing user";

export const builder = (yargs: Argv) =>
  yargs.options({
    username: {
      alias: "u",
      description: "Username for the key",
      required: true,
      help: "Username for the key",
    },
    password: {
      alias: "p",
      description: "Password for the key",
    },
  });

export async function handler(args: ArgShape) {
  const username = args.username;
  const password = args.password;

  console.log(
    `Adding ${chalk.yellow(username)} with ${chalk.yellow(
      password
    )} to the blockchain`
  );

  const resp = await keystore.deleteUser({ username, password });
  if (resp.data.success) {
    console.log(chalk.green(`Deleted user ${username}`));
  } else {
    console.log(`
      ${chalk.red(`Error deleting user ${username}`)}: ${
      resp.data.error.message
    }`);
  }
}
