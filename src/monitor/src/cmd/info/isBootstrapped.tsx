import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { info } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "isBootstrapped [args]";

export const desc = "Get bootstrapped status of a chain";

export const builder = (yargs: Argv) =>
  yargs.option("chain", {
    alias: "c",
    description: "Chain ID or alias",
    default: "X",
    choices: ["X", "C", "P"],
  });

export async function handler(args: ArgShape) {
  const chain = args.chain;
  const resp = await info.isBootstrapped(args);

  if (resp.data.isBootstrapped) {
    console.log(`Chain ${chain} is bootstrapped`);
  } else {
    console.error(`Error fetching node bootstrapped status for ${chain}`, resp);
  }
}
