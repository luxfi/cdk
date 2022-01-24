import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { info } from "../../lib/ava";
import chalk from "chalk";
import Table from "cli-table";

export const command = "getTxFee [args]";

export const desc = "Get the fees of the network";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
  const { data } = await info.getTxFee(args);
  if (data.creationTxFee) {
    const feeTable = new Table({
      head: ["Name", "Value"],
    });
    feeTable.push(["creationTxFee", data.creationTxFee]);
    feeTable.push(["txFee", data.txFee]);
    console.log(`${chalk.blue("Fees Info: ")}`);
    console.log(`${feeTable}`);
  } else {
    console.log(`${chalk.red('Error getting network fees!')}`);
    console.error('Reason:', data.error.message);
  }
}
