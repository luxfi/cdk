import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {avax, avm, platform} from "../../lib/ava";
import chalk from "chalk";

export const command = "exportAVAX [args]";

export const desc = "Get private key of an address.";

export const builder = (yargs: Argv) =>
    yargs.options({
        username: {
            alias: "u",
            description: "Username of the account",
            required: true
        },
        password: {
            alias: "p",
            description: "Password of the account",
            required: true
        },
        address: {
            description: "Address of the account",
            required: true
        }
    }).middleware((args) => {
        if (!args.chain || args.chain === "") args.chain = "P";

        return args;
    });

export async function handler(args: ArgShape) {
    const {chain} = args;
    let func = platform.exportKey;
    if (chain === "C") func = avax.exportKey;
    else if (chain === "X") func = avm.exportKey;

    const {data} = await func(args);

    if (data && data.privateKey) {
        console.log(`${chalk.green('privateKey: ')} ${data.txID}`);
    } else {
        console.log(`${chalk.red('Error exporting private key!')}`);
        console.error('Reason:', data.error.message);
    }
}
