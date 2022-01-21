import { V1Pod, V1Status } from "@kubernetes/client-node";
import { ReadableStreamBuffer, WritableStreamBuffer } from "stream-buffers";

import { Transform } from "stream";
import * as util from "util";
import { Exec } from "@kubernetes/client-node";
import { kc, api } from "../kube";
import * as uuid from "uuid";
import * as stream from "stream";
import { createDebug } from "../log";

class WritableStream extends Transform {
  private _string: string = "";
  constructor(...args: any[]) {
    super(...args, { objectMode: true });
  }
  body() {
    return this._string;
  }
  _transform(line: Buffer, encoding: string, processed: any) {
    this._string += line.toString();
    this.push(line);
    processed();
  }
}
class ReadableStream extends Transform {
  constructor(...args: any[]) {
    super(...args, { objectMode: true });
  }
  _transform(line: any, encoding: any, processed: any) {
    processed();
  }
}

export interface ExecResponse {
  body: any;
  data: any;
  exitStatus: any;
  streams: any;
}

const debug = createDebug("remoteExec");

export function exec(
  rawPath: string,
  method: string,
  params: any = { alias: "X" },
  options = { host: "127.0.0.1", port: 9650 }
) {
  return function (
    requestParams: any = {},
    rawContainerName?: string,
    rawPodName?: string,
    namespace: string = "default"
  ): Promise<ExecResponse> {
    return new Promise(async (resolve, reject) => {
      let containerName = rawContainerName;
      let podName = rawPodName;
      if (!containerName) {
        const pod = await getRunningPod(namespace);
        if (!pod) {
          throw new Error("No running pods found");
        }
        containerName = pod.spec!.containers[0].name;
        podName = pod.metadata!.name;
      }
      let opts = { ...options, ...requestParams };
      const exec = new Exec(kc);
      const osStream = new WritableStream();
      const errStream = new WritableStream();
      const isStream = new ReadableStream();
      osStream.setEncoding("utf8");
      errStream.setEncoding("utf8");
      isStream.setEncoding("utf8");

      let body = "";
      let data: any;
      let exitStatus = {};

      let payloadParams = Object.assign({}, params, requestParams);

      // Supply a function to manipulate the path if necessary
      let path = rawPath;
      if (opts.path) {
        path = typeof opts.path === "function" ? opts.path(path) : opts.path;
      }

      let headers: any = {
        accept: "application/json",
        "content-type": "application/json",
      };
      if (opts.headers) {
        Object.keys(opts.headers).forEach((key: string) => {
          headers[key] = opts.headers[key];
        });
      }
      if (opts.token || process.env.MONITOR_TOKEN) {
        const token = opts.token || process.env.MONITOR_TOKEN;
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Filter payload params
      let payload = Object.keys(payloadParams).reduce((acc: any, key: any) => {
        if (key === "_" || key === "$0") {
          return acc;
        }
        const val: any = payloadParams[key];
        if (val != "") {
          acc[key] = val;
        }
        return acc;
      }, {});

      if (opts.params) {
        // Ultimate override
        payload = opts.params;
      }

      const requestData = {
        jsonrpc: "2.0",
        id: uuid.v4().toString(),
        method,
        params: payload,
      };

      const headerStr = Object.keys(headers).reduce(
        (acc: string, key: string) => {
          return `${acc} -H '${key}:${headers[key]}'`;
        },
        ""
      );
      // -H 'accept:application/json' -H 'content-type:application/json;'
      let cmd = [
        "/bin/bash",
        "-c",
        `/usr/bin/curl -s -q ${headerStr} -XPOST --data '${JSON.stringify(
          requestData
        )}' http://${opts.host}:${opts.port}${path}`,
      ];
      debug(`Sending command: ${cmd}`);

      try {
        const resp = await exec.exec(
          namespace,
          podName!,
          containerName,
          cmd,
          osStream,
          errStream,
          isStream,
          true,
          (status: V1Status) => {
            exitStatus = JSON.stringify(status);
          }
        );
        resp.on("message", (message: string) => {
          body += message.toString();
        });
        resp.on("close", (code: number) => {
          body = osStream.body().trim();

          try {
            data = JSON.parse(body);
          } catch (e) {
            console.error(`Error occurred while parsing the response`);
            console.error(e);
            console.log(code);
            console.log("Body close", body);
            process.exit(1);
          }
          if (data.result) {
            data = data.result;
          }

          let ret = {
            body,
            data,
            exitStatus,
            streams: {
              osStream,
              errStream,
              isStream,
            },
          };
          return resolve(ret);
        });
      } catch (e) {
        console.error("Error", e, body);
        reject(e);
      }
    });
  };
}

export const getRunningPod = async (namespace: string = "default") => {
  const { body: pods } = await api.listNamespacedPod(namespace);
  if (!pods || !pods.items || pods.items.length < 1) {
    console.log("No pods");
    return;
  }
  let runningPods: V1Pod[] = pods.items.filter((pod: V1Pod) => {
    if (pod.status!.phase === "Running") {
      return pod;
    }
  });
  if (!runningPods || runningPods.length === 0) {
    return;
  }
  return runningPods[0];
};
