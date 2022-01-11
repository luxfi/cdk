import { Argv } from "yargs";
import { ArgShape } from "@cli";
import { V1Pod } from "@kubernetes/client-node";
import { api } from "../../lib/kube";
import { health } from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const command = "health [args]";

export const desc = "Get the health information of the blockchain";

export const builder = (yargs: Argv) => yargs;

export async function handler(args: ArgShape) {
  const { data } = await health.health();
  if (data) {
    const { healthy, checks } = data;
    figlet.textSync("Blockchain health");
    console.log(
      `Healthy: ${healthy ? chalk.green("true") : chalk.red("false")}`
    );
    const P = checks["P"];
    if (P.error) {
      console.log(`${"P-chain error"}: ${chalk.red(P.error.message)}`);
    }
  } else {
    console.log(`${chalk.red("Error fetching health")}`, data);
  }
}
