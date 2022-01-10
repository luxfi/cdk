#!/usr/bin/env ts-node
import yargs, { Arguments } from "yargs";
import fs from "fs";
import path from "path";

import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../lib/kube";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "address <cmd> [args]";

export const desc = "Address commands";

export const builder = (yargs: Argv) =>
  yargs
    .commandDir("./address")
    .usage("Usage: address <cmd> [args")
    .help("help")
    .alias("help", "h");

export async function handler(args: ArgShape) {}
