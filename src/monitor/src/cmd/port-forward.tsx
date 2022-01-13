import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod, V1Status, PortForward } from "@kubernetes/client-node";
import { Avalanche } from "avalanche";
import { kc } from "../lib/kube";
import * as net from "net";
import { getRunningPod } from "../lib/ava";

import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "port-forward [args]";

export const desc = "forward port to the kube cluster";

export const builder = (yargs: Argv) =>
  yargs.options({
    port: {
      alias: "p",
      type: "number",
      default: 8080,
    },
    deploymentName: {
      alias: "d",
      help: "deploymentName",
      type: "string",
    },
    hostAddress: {
      alias: "a",
      help: "Host address to listen for the server",
      default: "127.0.0.1",
    },
  });

export async function handler(args: ArgShape) {
  clear();
  let { namespace, deploymentName, port, hostAddress } = args;

  console.log(
    chalk.yellow(figlet.textSync("Forward port", { horizontalLayout: "full" }))
  );

  if (!deploymentName) {
    const runningPod = await getRunningPod(namespace);
    if (!runningPod) {
      console.log(
        `${chalk.red(
          "Error"
        )}: Could not find a running pod. Either specify the name in the arguments or check to see if your kube cluster is actually running`
      );
      return;
    }
    deploymentName = runningPod.metadata!.name;
  }

  const forward = new PortForward(kc);
  const server = net.createServer((socket: net.Socket) => {
    forward.portForward(
      namespace,
      deploymentName,
      [port],
      socket,
      null,
      socket
    );
  });

  console.log(`${chalk.blue("Listening on")}: http://${hostAddress}:${port}`);

  server.listen(port, hostAddress);
}
