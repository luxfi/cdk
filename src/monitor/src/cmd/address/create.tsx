import { Argv } from "yargs";
import { ArgShape } from "../../cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../../lib/kube";
import { platform } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import * as password from "secure-random-password";

export const command = "create [args]";

export const desc = "Create an address";

export const builder = (yargs: Argv) =>
  yargs.options({
    u: {
      alias: "username",
      description: "Username for the key",
      required: true,
      help: "Username for the key",
    },
    p: {
      alias: "password",
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

  const resp = await platform.createAddress({ username, password });
  console.log("resp ->", resp);
}
