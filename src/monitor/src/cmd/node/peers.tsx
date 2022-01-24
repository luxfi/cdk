import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { info } from "../../lib/ava";

export const command = "peers [args]";

export const desc = "Get peer information";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
  const resp = await info.peers(args);
  const json = JSON.parse(resp.body).result;
  console.log("resp ->", json);
}
