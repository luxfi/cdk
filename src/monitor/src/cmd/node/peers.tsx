import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../../lib/kube";
import { info } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "peers [args]";

export const desc = "Get peer information";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
  const resp = await info.peers(args);
  const json = JSON.parse(resp.body).result;
  console.log("resp ->", json);
}
