import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {platform} from "../../lib/ava";
import chalk from "chalk";

export const command = "getRewardUTXOs [args]";

export const desc = "Get UTXOs that were rewarded after the provided transaction's staking or delegation period ended.";

export const builder = (yargs: Argv) =>
    yargs.options({
        txID: {
            alias: "t",
            description: "ID of the staking or delegating transaction.",
            required: true,
        },
        encoding: {
            description: "specifies the format for the returned UTXOs.",
            default: "cb58",
            choices: ["cb58", "hex"]
        },
    });

export async function handler(args: ArgShape) {
    const {data} = await platform.getRewardUTXOs(args);
    if (data?.utxos) {
        console.log(data?.utxos);
    } else {
        console.log(`${chalk.red('Error getting reward UTXOs!')}`);
        console.error('Reason:', data.error.message);
    }
}
