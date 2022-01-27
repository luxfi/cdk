import { spawn } from "child_process";
const stream = require("stream");
export const createDebug = require("debug");
const debug = createDebug("openssl");

type Callback = (err: Error | undefined, buf: Buffer | undefined) => void;
type OptionsOrFunction = any | Callback;

const expectedStderrForAction = {
  "cms.verify": /^verification successful/i,
  genrsa: /^generating/i,
  pkcs12: /^mac verified ok/i,
  "req.new": /^generating/i,
  "req.verify": /^verify ok/i,
  rsa: /^writing rsa key/i,
  "smime.verify": /^verification successful/i,
  "x509.req": /^signature ok/i,
};

export const exec = (
  cmd: string,
  options: OptionsOrFunction,
  stdin?: string
) => {
  return new Promise((resolve, reject) => {
    let params: any[] = cmd
      .split(".")
      .map((value: string, key?: any) => (!key ? value : `-${value}`));
    const lastParams: any[] = [];

    Object.keys(options).forEach((key) => {
      if (options[key] === false) {
        lastParams.push(key);
      } else if (options[key] === true) {
        params.push(`-${key}`);
      } else {
        if (Array.isArray(options[key])) {
          options[key].forEach((value: any) => {
            params.push(`-${key}`, value);
          });
        } else {
          params.push(`-${key}`, options[key]);
        }
      }
    });
    // Add last params
    params = params.concat(lastParams);
    debug("Spawning openssl with params", `openssl ${params.join(" ")}`);

    const openssl = spawn("openssl", params);
    const outRes: Buffer[] = [];
    let outLen = 0;
    const errRes: Buffer[] = [];
    let errLen = 0;

    if (stdin) {
      console.log("STDIN", stdin);
      const stdinStream = new stream.Readable();
      stdinStream.push(stdin); // Add data to the internal queue for users of the stream to consume
      stdinStream.push(null); // Signals the end of the stream (EOF)
      stdinStream.pipe(openssl.stdin);
    }

    openssl.stdout.on("data", (data: Buffer) => {
      outLen += data.length;
      outRes.push(data);
    });

    openssl.stderr.on("data", (data: Buffer) => {
      errLen += data.length;
      errRes.push(data);
    });

    openssl.on("error", (err: Error) => {
      console.log("ERROR IN openssl", err);
    });

    openssl.on("close", (code: number) => {
      const stdout = Buffer.concat(outRes, outLen);
      const stderr = Buffer.concat(errRes, errLen).toString("utf-8");
      const expectedStderr: any = (expectedStderrForAction as any)[cmd];
      let err = null;

      if (code || (stderr && expectedStderr && !stderr.match(expectedStderr))) {
        err = new Error(stderr);
        (err as any).code = code;
        openssl.stdin.end();
        return reject(err);
      }

      openssl.stdin.end();
      resolve([err, stdout]);
    });
  });
};
