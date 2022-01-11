import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../lib/kube";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "node <cmd> [args]";

export const desc = "node commands";

export const builder = (yargs: Argv) =>
  yargs
    .commandDir("./node")
    .usage("Usage: node <cmd> [args")
    .help("help")
    .alias("help", "h");

export async function handler(args: ArgShape) {}
