import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { info } from "../../lib/ava";
import chalk from "chalk";
import Table from "cli-table";

export const command = "getNodeVersion [args]";

export const desc = "Get the version of the node";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
  const { data } = await info.getNodeVersion(args);
  if (data.version) {
    const versionTable = new Table({
      head: ["Name", "Value"],
    });
    versionTable.push(["BlockchainID", data.version]);
    versionTable.push(["databaseVersion", data.databaseVersion]);
    versionTable.push(["gitCommit", data.gitCommit]);
    console.log(`${chalk.blue("Version Info: ")}`);
    console.log(`${versionTable}`);

    const {vmVersions} = data;
    if (vmVersions?.avm) {
      const vmVersionsTable = new Table({
        head: ["Name", "Value"],
      });
      vmVersionsTable.push(["avm", vmVersions.avm]);
      vmVersionsTable.push(["evm", vmVersions.evm]);
      vmVersionsTable.push(["platform", vmVersions.platform]);
      console.log(`${chalk.blue("vmVersions Info: ")}`);
      console.log(`${vmVersionsTable}`);
    }
  } else {
    console.log(`${chalk.red('Error getting network version!')}`);
    console.error('Reason:', data.error.message);
  }
}
