import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../../lib/kube";
import { platform } from "../../lib/ava";
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
      description: "Private key address",
      required: true,
    },
  });

export async function handler(args: ArgShape) {
  const resp = await platform.getBalance(args);
  if (resp.data.balance) {
    const { balance, unlocked, lockedStakeable, lockedNotStakeable, utxoIDs } =
      resp.data;
    console.log(`${chalk.green("Balance")}: ${balance}`);
    console.log(`${chalk.green("Unlocked")}: ${unlocked}`);
    console.log(`${chalk.green("Locked stakeable")}: ${lockedStakeable}`);
    console.log(
      `${chalk.green("Locked not stakeable")}: ${lockedNotStakeable}`
    );
  } else {
    console.error("There was an error importing key", resp);
  }
}
