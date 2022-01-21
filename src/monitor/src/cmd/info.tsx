import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod, V1Status } from "@kubernetes/client-node";
import { Avalanche } from "avalanche";
import { api } from "../lib/kube";
import { info, platform } from "../lib/ava";

import Table from "cli-table";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "info [args]";

export const desc = "Info";

export const builder = (yargs: Argv) =>
  yargs
    .commandDir("./info")
    .usage("Usage: info <cmd> [args")
    .help("help")
    .alias("help", "h");

export async function handler(args: ArgShape) {
  clear();

  console.log("Information about the cluster");

  console.log(
    chalk.yellow(figlet.textSync("Info", { horizontalLayout: "full" }))
  );
  const podTable = new Table({
    head: ["Name", "IP", "Status"],
  });

  const { body: pods } = await api.listNamespacedPod(args.namespace);
  if (!pods || !pods.items || pods.items.length < 1) {
    console.log(chalk.red("No pods"));
    return;
  }
  pods.items.map((pod: V1Pod) => {
    podTable.push([pod.metadata!.name, pod.status!.podIP, pod.status!.phase]);
  });
  console.log(podTable.toString());

  const statusTable = new Table({
    head: ["Name", "Value"],
  });
  let { data: bId } = await info.getBlockchainID();
  let { data: statusData } = await info.isBootstrapped();
  let { data: peerData } = await info.peers();

  console.log(bId);

  statusTable.push(["BlockchainID", bId.blockchainID]);
  statusTable.push(["Bootstrapped", statusData.isBootstrapped]);
  statusTable.push(["Peers", peerData.numPeers]);
  // statusTable.push(["Uptime", uptimeData.error]);

  console.log(statusTable.toString());
}
