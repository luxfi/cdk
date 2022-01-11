import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../lib/kube";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "auth <cmd> [args]";

export const desc = "auth commands";

export const builder = (yargs: Argv) =>
  yargs
    .commandDir("./auth")
    .usage("Usage: auth <cmd> [args")
    .help("help")
    .alias("help", "h");

export async function handler(args: ArgShape) {}
