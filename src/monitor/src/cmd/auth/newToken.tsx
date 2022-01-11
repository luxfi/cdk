import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../../lib/kube";
import { auth } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "newToken [args]";

export const desc = "Get a new token";

export const builder = (yargs: Argv) =>
  yargs.options({
    password: {
      alias: "p",
      description: "node authorization token password",
      required: true,
    },
    endpoints: {
      array: true,
      alias: "e",
      default: "*",
    },
  });

export async function handler(args: ArgShape) {
  const resp = await auth.newToken(args);
  if (resp.data.token) {
    console.log(`${chalk.blue("New token")}: ${resp.data.token}`);
  } else {
    console.error(`${chalk.red("Error fetching a new token")}`, resp);
  }
}
