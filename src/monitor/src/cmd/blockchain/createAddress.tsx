import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../../lib/kube";
import { platform } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import { next_year } from "../../lib/date";

export const command = "createAddress [args]";

export const desc = "Create a P-chain address";

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
    chain: {
      alias: "c",
      description: "Chain",
      choices: ["P", "C"],
      default: "P",
    },
  });

export async function handler(args: ArgShape) {
  delete args["node-i-d"];
  delete args["chain"];
  const resp = await platform.createAddress(args);
  if (resp.data.address) {
    console.log(`${chalk.green("Created address")}: ${resp.data.address}`);
  } else {
    console.error("There was an error creating address", resp);
  }
}
