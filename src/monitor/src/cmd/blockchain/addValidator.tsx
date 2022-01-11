import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../../lib/kube";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import { next_year } from "../../lib/config";

export const command = "add-validator [args]";

export const desc = "Add a validator to a node";

export const builder = (yargs: Argv) =>
  yargs.options({
    nodeID: {
      type: "string",
    },
    startTime: {
      type: "number",
      default: new Date().getTime() / 1000,
    },
    endTime: {
      type: "number",
      default: next_year,
    },
    stakeAmount: {
      type: "number",
      default: 100000000,
    },
  });

export async function handler(args: ArgShape) {}
