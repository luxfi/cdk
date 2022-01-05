import { Argv } from "yargs";
import { ArgShape } from "../cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../lib/kube";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "exec [args]";

export const desc = "Execute a command on the cluster";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {}
