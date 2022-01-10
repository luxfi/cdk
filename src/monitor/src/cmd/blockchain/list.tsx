import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { platform } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "list [args]";

export const desc = "List all blockchains";

export const builder = (yargs: Argv) =>
  yargs.options({
    t: {
      alias: "type",
      describe: "type to fetch",
      choices: ["blockchains", "subnets"],
      default: "blockchains",
    },
  });

const handleGetBlockchains = async (args: ArgShape) => {
  const resp = await platform.getBlockchains();
  console.log(resp);
};

const handleGetSubnets = async (args: ArgShape) => {
  const resp = await platform.getSubnets();
  console.log(resp);
};

export async function handler(args: ArgShape) {
  switch (args.type) {
    case "subnets":
      return handleGetSubnets(args);
    case "blockchains":
    default:
      return handleGetBlockchains(args);
  }
}
