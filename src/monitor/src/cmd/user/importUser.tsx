import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../../lib/kube";
import { keystore } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "importUser [args]";

export const desc = "Import a existing user";

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
      required: true,
    },
    encoding: {
      alias: "e",
      description: "Encoding",
      choices: ["cb58", "hex"],
      default: "cb58",
    },
    user: {
      alias: "n",
      description: "User to import",
      required: true,
    },
  });

export async function handler(args: ArgShape) {
  const username = args.username;
  const password = args.password;
  const encoding = args.encoding;
  const user = args.user;

  console.log(`Importing ${chalk.yellow(username)} from the blockchain`);

  const resp = await keystore.importUser({ username, password, encoding, user });
  console.log(resp);

  if (resp.data.user) {
    console.log(`${chalk.green("Successfully imported user")}`);
    console.log(resp.data.user);
  } else {
    console.log(`${chalk.red(`Error importing user ${username}`)}`, resp);
  }
  // if (resp.data.success) {
  //   console.log(chalk.green(`Created user ${username}`));
  // } else {
  //   console.log(
  //     `${chalk.red(`Error creating user ${username}`)}: ${
  //       resp.data.error.message
  //     }`
  //   );
  // }
}
