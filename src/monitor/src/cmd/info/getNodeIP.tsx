import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { info } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "getNodeIP [args]";

export const desc = "Get the IP of a node";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
  const resp = await info.getNodeIP();
  console.log(resp);

  if (resp.data.ip) {
    console.log(`Node ip: ${chalk.blue(resp.data.ip)}`);
  } else {
    console.error(`Error fetching node ip`, resp);
  }
}
