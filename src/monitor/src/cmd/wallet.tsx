import { Argv } from "yargs";
import { ArgShape } from "@cli";

export const command = "wallet <cmd> [args]";

export const desc = "Wallet commands";

export const builder = (yargs: Argv) =>
    yargs
        .commandDir("./wallet")
        .usage("Usage: address <cmd> [args")
        .help("help")
        .alias("help", "h");

export async function handler(args: ArgShape) {}
