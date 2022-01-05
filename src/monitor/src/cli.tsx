#!/usr/bin/env ts-node
import yargs, { Arguments } from "yargs";
import fs from "fs";
import path from "path";

export const npmPackage = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./../package.json")).toString()
);

export interface UniversalArgs {
  apiUrl: string;
}

export interface AdditionalArgs {
  [key: string]: any;
}

export type ArgShape<Additional = AdditionalArgs> = Arguments<
  UniversalArgs & Additional
>;

yargs
  .options({
    apiUrl: {
      alias: "h",
      normalize: true,
      description: `API url`,
    },
    namespace: {
      alias: "n",
      description: `Namespace`,
      default: "default",
    },
    networkId: {
      alias: "i",
      description: `Network id`,
      default: 4200,
    },
    host: {
      description: "Host of avalanche",
      default: "localhost",
    },
    port: {
      description: "Port of avalanche",
      default: 9650,
    },
    protocol: {
      description: "Protocol of avalanche",
      default: "http",
    },
    networkId: {
      description: "Network ID of avalanche",
      default: 4200,
    },
  })
  .commandDir("./cmd")
  .usage("Usage: <cmd> [args]")
  .wrap(Math.min(yargs.terminalWidth(), 160))
  .help("help")
  .alias("help", "h")
  .version(npmPackage.version)
  .alias("version", "v")
  .hide("help")
  .hide("version")

  .demandCommand()
  .help().argv;
