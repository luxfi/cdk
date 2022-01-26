import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { platform } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import Table from "cli-table";

export const command = "list [args]";

export const desc = "List all blockchains";

export const builder = (yargs: Argv) =>
  yargs.options({
    type: {
      alias: "t",
      describe: "type to fetch",
      choices: ["blockchains", "subnets"],
      default: "blockchains",
    },
  });

const handleGetBlockchains = async (args: ArgShape) => {
  const {data} = await platform.getBlockchains(args);
  if (data.blockchains) {
    clear();
    console.log(
        chalk.yellow(figlet.textSync("Blockchains", { horizontalLayout: "full" }))
    );
    const listTable = new Table({
      head: ["ID", "Name", "Subnet ID", "VM ID"],
    });
    data.blockchains.forEach((blockchain: any) => {
      listTable.push([blockchain.id, blockchain.name, blockchain.subnetID, blockchain.vmID]);
    })
    console.log(listTable.toString());
  } else {
    console.log(`${chalk.red('Error getting blockchain list!')}`);
    console.error('Reason:', data.error.message);
  }
};

const handleGetSubnets = async (args: ArgShape) => {
  const {data} = await platform.getSubnets(args);
  if (data.subnets) {
    clear();
    console.log(
        chalk.yellow(figlet.textSync("Subnets", { horizontalLayout: "full" }))
    );
    const listTable = new Table({
      head: ["ID", "Control Keys", "Threshold"],
    });
    data.subnets.forEach((subnet: any) => {
      listTable.push([subnet.id, subnet.controlKeys, subnet.threshold]);
    })
    console.log(listTable.toString());
  } else {
    console.log(`${chalk.red('Error getting subnets list!')}`);
    console.error('Reason:', data.error.message);
  }
};

export async function handler(args: ArgShape) {
  switch (args.type) {
    case "subnets":
      return handleGetSubnets(args);
    case "blockchains":
    default:
      return handleGetBlockchains(args);
  }
}
