import { Argv } from "yargs";
import { ArgShape } from "../../cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../lib/kube";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "create address [args]";

export const desc = "Create an address";

export const builder = (yargs: Argv) =>
  yargs.options({
    u: {
      alias: "username",
      description: "Username for the key",
      required: true,
    },
    p: {
      alias: "password",
      description: "Password for the key",
      required: true,
    },
  });

export async function handler(args: ArgShape) {}
