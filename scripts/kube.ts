#!/usr/bin/env ts-node

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const shell = require("shelljs");

enum COMMAND_STRINGS {
  GET_POD_ID = `kubectl get pod --no-headers -o jsonpath='{.items..metadata.name}'`,
  GET_SERVICE_PORT = `kubectl get pod --template='{{(index (index .spec.containers 0).ports 0).containerPort}}'`,
  PORT_FORWARD = `kubectl port-forward`,
}

const yarg = require("yargs")
  .usage("Usage: [args]")
  .options({
    namespace: {
      alias: "n",
      type: "string",
      default: "monitoring",
      help: "namespace",
    },
    selector: {
      alias: "s",
      help: "app",
      default: "prometheus",
    },
  })
  .demandCommand()
  .usage("Usage: <cmd> [args]")
  .help("Remove the duplication of commands")
  .alias("help", "h");

portForward(yarg).argv;

function portForward(yargv: any) {
  return yargv.command(
    "port-forward",
    "Setup port forwarding with kubectl",
    (yargs: any) => yargs.help("help"),
    async (argv: any) => {
      console.log(`${chalk.green("Setting up port forwarding")}`);
      let cmd: string = `${COMMAND_STRINGS.GET_POD_ID} -n ${argv.namespace} --selector app=${argv.selector}`;
      const pod_id = await exec(cmd);
      cmd = `${COMMAND_STRINGS.GET_SERVICE_PORT} -n ${argv.namespace} ${pod_id}`;
      const port = await exec(cmd);
      cmd = `${COMMAND_STRINGS.PORT_FORWARD} -n ${argv.namespace} ${pod_id} ${port}`;
      console.log(
        `${chalk.green(
          `Forwarding for pod ${chalk.bold(pod_id)} on port ${chalk.bold(port)}`
        )}
You can reach it at: ${chalk.blue(`http://localhost:${port}`)}
      `
      );
      await exec(cmd);
    }
  );
}

async function exec(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = shell.exec(cmd, { async: true, silent: true });
    child.stdout.on("data", resolve);
    child.stderr.on("data", reject);
  });
}
