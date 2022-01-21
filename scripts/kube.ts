#!/usr/bin/env ts-node

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const shell = require("shelljs");
const debug = require("debug")("kube");
const { spawn } = require("child_process");

enum COMMAND_STRINGS {
  EXEC_CONTAINER = `kubectl exec`,
  PODEXEC = `kubectl run -it --rm --restart=Never alpine --image=alpine`,
  GET_POD_ID = `kubectl get pod -o jsonpath='{.items[?(@.status.phase=="Running")].metadata.name}'`,
  GET_SERVICE_PORT = `kubectl get pod -o jsonpath='{.spec.containers[0].ports[0].containerPort}'`,
  PORT_FORWARD = `kubectl port-forward`,
  GET_SERVICE = `kubectl get svc`,
  GET_SERVICE_IP = `kubectl get pods -o go-template='{{range .items}}{{.status.podIP}}{{\"\\n\"}}{{end}}'`,
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
      alias: "l",
      help: "app",
    },
  })
  .demandCommand()
  .usage("Usage: <cmd> [args]")
  .help("Remove the duplication of commands")
  .alias("help", "h");

[portForward, getService, execOnPod].reduce(
  (yarg: any, fn: any) => fn(yarg),
  yarg
).argv;

// -it --tty -- /bin/sh
function execOnPod(yargv: any) {
  return yargv.command(
    "exec",
    "execute something on a pod",
    (yargs: any) =>
      yargs
        .options({
          command: {
            alias: "c",
            help: "Command to execute",
            default: "/bin/sh",
          },
        })

        .help("Execute the command on a pod"),
    async (args: any) => {
      const pod_id = await getPodId(args);
      let cmd = [
        "exec",
        "-n",
        args.namespace,
        "-it",
        "--tty",
        pod_id,
        "--",
        args.command,
      ];
      debugcmd(cmd, "Execute command");

      const cmdarr = cmd.splice(0);
      console.log(cmdarr);
      console.log(`${chalk.red(chalk.bold("NOTICE"))}`);
      console.log(
        `${chalk.white(
          "Unfortunately the shell in this command cannot be executed. Until we debug why, please run the following command:"
        )}`
      );
      console.log(`kubectl ${cmdarr.join(" ")}`);
      // const child = spawn("kubectl", cmdarr);
      // child.stdout.on("data", (buf: Buffer) =>
      //   console.log("stdout: ", buf.toString("utf-8"))
      // );
      // child.stderr.on("data", (buf: Buffer) =>
      //   debug("stderr: ", buf.toString("utf-8"))
      // );
      // child.on("close", (code: number) => debug(`Close process: ${code}`));
      // child.on("error", (err: Error) => debug(`Error in process: ${err}`));
    }
  );
}

function getService(yargv: any) {
  return yargv.command(
    "get-service",
    "Get service(s)",
    (yargs: any) =>
      yargs
        .options({
          servicename: {
            help: "servicename",
          },
          ips: {
            alias: "i",
            help: "only get service ips",
          },
          hostnames: {
            help: `get hostnames from coredns`,
            implies: "port",
          },
          port: {
            alias: "p",
            help: `service running on port`,
          },
        })
        .help("help"),
    async (argv: any) => {
      let cmd: string[] = [];
      const getIps = async (argv: any) => {
        let cmd = getcmd(COMMAND_STRINGS.GET_SERVICE_IP, argv);
        if (argv.servicename) cmd.push(argv.servicename);
        debugcmd(cmd, "Get IPS");
        return await exec(cmd);
      };
      if (argv.getips) {
        const ips = getIps(argv);
        console.log(`${chalk.green("IPS")}: ${ips}`);
      } else if (argv.hostnames) {
        let ips = await getIps(argv);
        let iparr = ips.split("\n").filter((ip: string) => ip !== "");
        cmd = [
          `for ep in ${iparr
            .map((ip: string) => `${ip}:${argv.port}`)
            .join(" ")}; do
          wget -qO- $ep
        done
        `,
        ];
        const res = await exec_in_pod(cmd);
        console.log("res ->", res);
      } else {
        console.log(`${chalk.green("Getting services")}`);
        cmd = getcmd(COMMAND_STRINGS.GET_SERVICE, argv);
        if (argv.servicename) cmd.push(argv.servicename);
        debugcmd(cmd, "Get Services");
        const services = await exec(cmd);
        debug("Got services\n", services);
      }
    }
  );
}
function portForward(yargv: any) {
  return yargv.command(
    "port-forward",
    "Setup port forwarding with kubectl",
    (yargs: any) => yargs.help("help"),
    async (argv: any) => {
      console.log(`${chalk.green("Setting up port forwarding")}`);
      const pod_id = await getPodId(argv);
      let cmd: string[] = [
        COMMAND_STRINGS.GET_SERVICE_PORT,
        "-n",
        argv.namespace,
        pod_id,
      ];
      debugcmd(cmd, "Get pod service port");
      const port = await exec(cmd);
      cmd = [COMMAND_STRINGS.PORT_FORWARD, "-n", argv.namespace, pod_id, port];
      debugcmd(cmd, "Port forwarding command");
      console.log(
        `${chalk.green(
          `Forwarding for pod ${chalk.bold(pod_id)} on port ${chalk.bold(port)}`
        )}
You can reach it at: ${chalk.blue(`http://localhost:${port}`)}
      `
      );
      try {
        await exec(cmd);
      } catch (e) {
        console.error("An error occurred", e);
      }
    }
  );
}

async function getPodId(argv: any) {
  let cmd = getcmd(COMMAND_STRINGS.GET_POD_ID, argv);
  debugcmd(cmd, "Get Pod ID");
  const pod_id = await exec(cmd);
  return pod_id;
}

function getcmd(cmd: string, args: any) {
  let cmds: string[] = [cmd];
  if (args.namespace) cmds.push(`-n ${args.namespace}`);
  if (args.selector) cmds.push(`--selector ${args.selector}`);
  return cmds;
}

function debugcmd(cmd: string[], title = "") {
  debug(title, cmd.join(" "));
}

async function exec(cmd: string[], options: any = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = shell.exec(
      ([] as string[]).concat(cmd, []).join(" "),
      Object.assign(
        {},
        {
          async: true,
          silent: true,
        },
        options
      )
    );
    let body = "";
    child.stdout.on("data", (buf: any) => (body += buf));
    child.stdout.on("close", () => resolve(body));
    child.stderr.on("data", reject);
  });
}

async function exec_in_pod(cmd: string[], options: any = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    let cmdarr: string[] = ([] as string[]).concat(
      COMMAND_STRINGS.PODEXEC,
      `"${cmd}"`
    );
    debugcmd(cmdarr, "Executing in pod");
    const child = shell.exec(
      cmdarr.join(" "),
      Object.assign(
        {},
        {
          async: true,
          silent: true,
        },
        options
      )
    );
    let body = "";
    child.stdout.on("data", (buf: any) => (body += buf));
    child.stdout.on("close", () => resolve(body));
    child.stderr.on("data", reject);
  });
}
