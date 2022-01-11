import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../../lib/kube";
import { keystore } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import * as password from "secure-random-password";

export const command = "create [args]";

export const desc = "Create a new user";

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
    g: {
      alias: "generate",
      description: "generate a password for the user",
    },
  });

const generatePassword = () => {
  return password.randomPassword({
    length: 12,
    characters: [
      password.lower,
      password.upper,
      password.digits,
      password.symbols,
    ],
  });
};

export async function handler(args: ArgShape) {
  const username = args.username;
  const password = args.password || generatePassword();

  console.log(
    `Adding ${chalk.yellow(username)} with ${chalk.yellow(
      password
    )} to the blockchain`
  );

  const resp = await keystore.createUser({ username, password });
  if (resp.data.success) {
    console.log(chalk.green(`Created user ${username}`));
  } else {
    console.log(
      `${chalk.red(`Error creating user ${username}`)}: ${
        resp.data.error.message
      }`
    );
  }
}
