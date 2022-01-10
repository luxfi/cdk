#!/usr/bin/env ts-node

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
let cfg = require("./default-config.json");

const SAVE_CONFIG_PATH = path.join(
  __dirname,
  "..",
  "docker",
  "avalanchego",
  "avalanche-config.json"
);

interface Schedule {
  amount: number;
  locktime: number;
}

interface Staker {
  nodeID: string;
  rewardAddrress: string;
  delegationFee: number;
}

interface Allocation {
  ethAddr: string;
  avaxAddr?: string;
  initialAmount: number;
  unlockSchedule: Schedule[];
}

interface GenesisConfig {
  networkID: number;
  allocations: Allocation[];
  startTime: number;
  initialStakeDuration: number;
  initialStakeDurationOffset: number;
  initialStakedFunds: string[];
  initialStakers: Staker[];
  message: string;
}

const yargs = require("yargs");

const generateGenesisCommand = generateGenesis();
const generateConfigCommand = generateConfig();
let argv = yargs
  .parserConfiguration({
    "short-option-groups": true,
    "dot-notation": true,
    "parse-numbers": true,
    "parse-positional-numbers": true,
    "boolean-negation": true,
    "deep-merge-config": true,
    "strip-aliased": true,
    "strip-dashed": false,
  })
  .usage("Usage: [args]")
  .command(
    "generate-genesis",
    "Generate a gensis file",
    generateGenesisCommand.builder,
    generateGenesisCommand.handler
  )
  .command(
    "generate-config",
    "Generate a config file",
    generateConfigCommand.builder,
    generateConfigCommand.handler
  )
  .options({
    "network-id": {
      default: 4200,
      help: "Identity of the network the node should connect to",
      // choices: ["mainnet", "fuji", "testnet", "local", `local-{id}`],
      coerce: (opt: string | string) => {
        if (typeof opt === "number") {
          return `local-${opt}`;
        }
        return opt;
      },
    },
  })
  .demandCommand()
  .usage("Usage: <cmd> [args]")
  .help("Create the default avalanche configuration").argv;

function generateConfig() {
  const builder = (yargs: any) =>
    yargs
      .options({
        "api-admin-enabled": {
          type: "boolean",
          default: true,
        },
        "api-auth-required": {
          type: "boolean",
          default: false,
        },
        "api-auth-password": {
          help: "Authorization token required",
          type: "boolean",
          default: false,
        },
        "api-health-enabled": {
          help: "Enable health api",
          type: "boolean",
          default: true,
        },
        "index-enabled": {
          type: "boolean",
          default: false,
        },
        "api-info-enabled": {
          type: "boolean",
          default: true,
          help: "Expose the info API",
        },
        "api-metrics-enabled": {
          type: "boolean",
          default: true,
          help: "enabled metrics API",
        },
        "bootstrap-retry-enabled": {
          type: "boolean",
          default: true,
          help: "Retry bootstrapping if fails",
        },
        genesis: {
          help: "path to a JSON file",
        },
        "genesis-content": {
          help: "Base64 encoded genesis data to use",
        },
        "log-display-level": {
          help: "Log level",
          choices: ["Off", "Fatal", "Error", "Warn", "Info", "Debug", "Verbo"],
          default: "Verbo",
        },
        "log-display-highlight": {
          help: "Highlight logs",
          choices: ["auto", "plain", "colors"],
          default: "auto",
        },
        "public-ip": {
          help: "Public facing address",
          description: "Set the ip to be public",
          default: "127.0.0.1",
        },
        "dynamic-public-ip": {
          help: "poll for public ip for the node",
          choices: ["opendns", "ifconfigco", "ifconfigme"],
        },
        "staking-port": {
          help: "port for the staking server",
          default: 9651,
          type: "number",
        },
        "staking-enabled": {
          type: "boolean",
          help: "Set PoS",
          default: true,
        },
        "eth-apis": {
          default: [
            "public-eth",
            "public-eth-filter",
            "net",
            "web3",
            "internal-public-eth",
            "internal-public-blockchain",
            "internal-public-transaction-pool",
          ],
          help: "eth apis enabled on the server",
        },
        "output-file": {
          help: "File to save the config",
          default: path.join(
            __dirname,
            "..",
            "docker",
            "avalanchego",
            "avalanche-config.json"
          ),
          normalize: true,
        },
      })
      .help();
  const handler = (argv: any) => {
    console.log("Generating config");
    const outputFile = argv.outputFile;

    const genesisData = fs.readFileSync(
      path.join(__dirname, "./genesis-config.json"),
      "utf-8"
    );

    delete argv["_"];
    delete argv["$0"];

    argv["genesis"] = Buffer.from(genesisData).toString("base64");
    const newConfig = Object.assign({}, cfg, argv);

    fs.writeFileSync(outputFile, JSON.stringify(newConfig, null, 2));
  };

  return { builder, handler };
}

function generateGenesis() {
  const builder = (yargs: any) =>
    yargs
      .options({
        allocation: {
          help: "Set an allocation with allocation data in JSON format",
          array: true,
        },
        "start-time": {
          type: "number",
          default: Date.now(),
        },
        "initial-stake-duration": {
          help: "Set the initial stake duration",
          default: 60 * 60 * 24 * 30, // month
        },
        "initial-stake-duration-offset": {
          help: "set the initial offset of the staking",
          default: 5400,
        },
        "initial-staked-funds": {
          type: "string",
          help: "Address to set initial staked funds",
          array: true,
        },
        "initial-staker": {
          help: "json object of the initial staker data (nodeID, rewardAddress, delegationFee)",
          array: true,
        },
        "output-file": {
          help: "File to save the config",
          default: path.join(__dirname, "genesis-config.json"),
          normalize: true,
        },
      })
      .usage("Usage: [args]")
      .help();

  const handler = (argv: any) => {
    const outputFile = argv.outputFile;
    console.log(
      chalk.blue("Creating genesis block based on arguments"),
      outputFile
    );
    const initialGenesis = JSON.parse(
      fs.readFileSync(path.join(__dirname, "genesis-config.json"), "utf-8")
    );
    const networkID = argv.networkId;
    const allocations = (argv.allocation || []).map((s: string) =>
      JSON.parse(s)
    );
    const startTime = argv.startTime || Date.now();
    const initialStakeDuration = argv.initialStakeDuration;
    const initialStakeDurationOffset = argv.initialStakeDurationOffset;
    const initialStakedFunds = argv.initialStakedFunds;
    const initialStakers = (argv.initialStaker || []).map((s: string) =>
      JSON.parse(s)
    );

    const cfg = Object.assign({}, initialGenesis, {
      networkID,
      allocations,
      startTime,
      initialStakeDuration,
      initialStakeDurationOffset,
      initialStakedFunds,
      initialStakers,
    });

    fs.writeFileSync(outputFile, JSON.stringify(cfg, null, 2));
  };
  return { builder, handler };
}
