import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { info } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "getBlockchainID [args]";

export const desc = "Get the ID of the blockchain";

export const builder = (yargs: Argv) =>
  yargs.option("alias", {
    alias: "a",
    default: "X",
    choices: ["X", "C", "P"],
  });

export async function handler(args: ArgShape) {
  const alias = args.alias;
  const resp = await info.getBlockchainID({ alias });

  if (resp.data.blockchainID) {
    console.log(`blockchainID: ${chalk.blue(resp.data.blockchainID)}`);
  } else {
    console.error(`Error fetching blockchainID ${alias}`, resp);
  }
}
