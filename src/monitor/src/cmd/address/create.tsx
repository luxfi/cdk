import { Argv } from "yargs";
import { ArgShape } from "../../cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../../lib/kube";
import { avm } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "create [args]";

export const desc = "Create an address on the avm chain";

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
      required: true,
    },
    chain: {
      alias: "c",
      description: "chain to create address in",
      default: "X",
    },
  });

export async function handler(args: ArgShape) {
  const chain = args.chain;
  const opts = Object.assign({}, args, {
    path: (originalPath: string) => `${originalPath}/${chain}`,
  });
  delete args["chain"];

  const resp = await avm.createAddress(opts);
  if (resp.data.address) {
    console.log(`Created address: ${resp.data.address}`);
  } else {
    console.error(`Error creating new address`, resp);
  }
}
