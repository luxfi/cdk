import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../lib/kube";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "blockchain <cmd> [args]";

export const desc = "Blockchain commands";

export const builder = (yargs: Argv) =>
  yargs
    .commandDir("./blockchain")
    .usage("Usage: blockchain <cmd> [args")
    .help("help")
    .alias("help", "h");

export async function handler(args: ArgShape) {}
