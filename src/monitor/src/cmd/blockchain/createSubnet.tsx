import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../../lib/kube";
import { platform } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import { next_year } from "../../lib/date";

export const command = "createSubnet [args]";

export const desc = "Create a subnet";

export const builder = (yargs: Argv) =>
  yargs.options({
    username: {
      alias: "u",
      description: "Username for the key",
      required: true,
      help: "Username for the key",
    },
    password: {
      alias: "p",
      description: "Password for the key",
    },
    threshold: {
      type: "number",
      default: 2,
    },
    controlKey: {
      type: "string",
      array: true,
    },
  });

export async function handler(args: ArgShape) {
  delete args["node-i-d"];
  delete args["chain"];

  const controlKeys = args["controlKey"];
  const threshold = args.threshold;

  if (controlKeys.length != threshold) {
    console.error(
      `${chalk.red("Must pass same number of control keys as the threshold")}`
    );
    return;
  }

  const resp = await platform.createSubnet({ ...args, controlKeys });
  if (resp.data.changeAddr) {
    console.log(`${chalk.green("Created subnet")}: ${resp.data.address}`);
  } else {
    console.error("There was an error creating subnet", resp);
  }
}
