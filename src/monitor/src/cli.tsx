#!/usr/bin/env ts-node
import yargs, { Arguments } from "yargs";
import fs from "fs";
import path from "path";
import { VERSION } from "./lib/constants";

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
  .parserConfiguration({
    "short-option-groups": true,
    "camel-case-expansion": false,
    "dot-notation": true,
    "parse-numbers": true,
    "parse-positional-numbers": true,
    "boolean-negation": true,
    "strip-aliased": true,
    "strip-dashed": false,
  })
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
    token: {
      description: "AUTH token",
    },
  })
  .commandDir("./cmd")
  .usage("Usage: <cmd> [args]")
  .wrap(Math.min(yargs.terminalWidth(), 160))
  .help("help")
  .alias("help", "h")
  .version(VERSION)
  .alias("version", "v")
  .hide("help")
  .hide("version")

  .demandCommand()
  .help().argv;
