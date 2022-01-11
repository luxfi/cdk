import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { info } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "getNodeID [args]";

export const desc = "Get the ID of the node";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
  const { data } = await info.getNodeID(args);
  if (data.nodeID) {
    console.log(`NodeID: ${chalk.blue(data.nodeID)}`);
  } else {
    console.error(`Error fetching nodeID`, data);
  }
}
