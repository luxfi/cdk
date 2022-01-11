import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../../lib/kube";
import { platform } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import { ten_minutes, one_month } from "../../lib/date";

export const command = "addValidator [args]";

export const desc = "Add a validator to a node";

export const builder = (yargs: Argv) =>
  yargs.options({
    nodeID: {
      type: "string",
      required: true,
    },
    startTime: {
      default: Math.floor(ten_minutes.getTime() / 1000),
    },
    endTime: {
      default: Math.floor(one_month.getTime() / 1000),
    },
    stakeAmount: {
      type: "number",
      default: 2000000000000,
    },
    rewardAddress: {
      type: "string",
    },
    changeAddr: {
      type: "string",
      default: null,
    },
    delegationFeeRate: {
      type: "number",
      default: 10,
    },
    username: {
      alias: "u",
      description: "Username for the key",
      required: true,
      help: "Username for the key",
    },
    password: {
      alias: "p",
      description: "Password for the key",
      required: true,
    },
  });

export async function handler(args: ArgShape) {
  delete args["node-i-d"];
  delete args["alias"];

  const resp = await platform.addValidator(args);
  console.log("resp", resp);
}
