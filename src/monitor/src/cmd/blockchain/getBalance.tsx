import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../../lib/kube";
import { platform, avax, avm } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import { next_year } from "../../lib/date";

export const command = "getBalance [args]";

export const desc = "Get the balance of the key";

export const builder = (yargs: Argv) =>
  yargs.options({
    address: {
      alias: "a",
      type: "string",
      description: "Private key address",
      required: true,
    },
    assetID: {
      description: "Asset ID name, i.e. AVAX",
      default: "AVAX",
    },
  });

export async function handler(args: ArgShape) {
  const { chain, address, assetID } = args;

  const path = (orig: string) => {
    if (chain === "X") {
      return `/ext/bc/${chain}`;
    } else if (chain === "C") {
      return `/ext/bc/${chain}/rpc`;
    } else {
      return `/ext/bc/P`;
    }
  };
  let opts: any = {};

  if (chain === "C") {
    opts = { params: [address.toString("16"), "latest"], path };
  } else {
    opts = { ...args, address };
  }

  const func =
    args.chain === "X"
      ? avm.getBalance
      : args.chain === "C"
      ? avax.getBalance
      : platform.getBalance;
  const resp = await func(opts);

  if (resp.data.balance) {
    const { balance, unlocked, lockedStakeable, lockedNotStakeable, utxoIDs } =
      resp.data;
    console.log(`${chalk.green("Balance")}: ${balance}`);
    console.log(`${chalk.green("Unlocked")}: ${unlocked}`);
    console.log(`${chalk.green("Locked stakeable")}: ${lockedStakeable}`);
    console.log(
      `${chalk.green("Locked not stakeable")}: ${lockedNotStakeable}`
    );
  } else if (resp.data) {
    console.log(resp.data);
    console.log(`${chalk.green("Balance:")}: ${resp.data}`);
  } else {
    console.error("Getting balance", resp);
  }
}
