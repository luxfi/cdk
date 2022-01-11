import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../../lib/kube";
import { keystore } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "exportUser [args]";

export const desc = "Exports an existing user";

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
      required: true,
    },
    e: {
      alias: "encoding",
      description: "Encoding",
      choices: ["cb58", "hex"],
      default: "cb58",
    },
  });

export async function handler(args: ArgShape) {
  const username = args.username;
  const password = args.password;
  const encoding = args.encoding;

  console.log(`Exporting ${chalk.yellow(username)} from the blockchain`);

  const resp = await keystore.exportUser({ username, password, encoding });
  if (resp.data.user) {
    console.log(`${chalk.green("Successfully exported user")}`);
    console.log(resp.data.user);
  } else {
    console.log(`${chalk.red(`Error exporting user ${username}`)}`, resp);
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
