import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../../lib/kube";
import { platform } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import { next_year } from "../../lib/date";

export const command = "importKey [args]";

export const desc = "Import a private key";

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
    privateKey: {
      alias: "k",
      description: "Private key",
      required: true,
    },
  });

export async function handler(args: ArgShape) {
  const resp = await platform.importKey(args);
  if (resp.data.address) {
    console.log(`${chalk.green("Imported key")}: ${resp.data.address}`);
  } else {
    console.error("There was an error importing key", resp);
  }
}
