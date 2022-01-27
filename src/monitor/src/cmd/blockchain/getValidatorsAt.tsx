import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {platform} from "../../lib/ava";
import chalk from "chalk";

export const command = "getValidatorsAt [args]";

export const desc = "Get the validators and their weights of a subnet or the Primary Network at a given P-Chain height.";

export const builder = (yargs: Argv) =>
    yargs.options({
        height: {
            description: "P-Chain height to get the validator set at",
            required: true,
            type: "number"
        },
        subnetID: {
            alias: 's',
            description: "Subnet ID to get the validator set of"
        }
    })

export async function handler(args: ArgShape) {
    const {data} = await platform.getValidatorsAt(args);

    if (data?.validators) {
        console.log(`${chalk.green('Validators: ')} ${data.validators}`);
    } else {
        console.log(`${chalk.red('Error getting validators!')}`);
        console.error('Reason:', data.error.message);
    }
}
