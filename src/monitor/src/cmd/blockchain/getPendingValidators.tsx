import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../../lib/kube";
import { platform } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "getPendingValidators [args]";

export const desc = "Fetch the pending validators";

export const builder = (yargs: Argv) =>
  yargs.options({
    subnetID: {
      type: "string",
      default: null,
    },
    nodeIDs: {
      type: "string",
      array: true,
    },
  });

export async function handler(args: ArgShape) {
  const resp = await platform.getPendingValidators(args);
  if (resp.data) {
    console.log(`Pending validator information: `, resp.data);
  } else {
    console.error(`Error fetching pending validators`, resp);
  }
}
