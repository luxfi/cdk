import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod, V1Status } from "@kubernetes/client-node";
import { Avalanche } from "avalanche";
import { api } from "../lib/kube";
import { info, platform } from "../lib/ava";

import Table from "cli-table";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "addValidator [args]";

export const desc = "Add a validator to the blockchain";

export const builder = (yargs: Argv) =>
  yargs.options({
    nodeId: {
      required: true,
      description: "Node ID of the new validator",
    },
    stakeAmount: {
      description: "Amount staked",
      required: true,
    },
  });

export async function handler(args: ArgShape) {
  clear();

  console.log(
    chalk.yellow(figlet.textSync("Add Validator", { horizontalLayout: "full" }))
  );
}
