import {Argv} from "yargs";
import {ArgShape} from "../../cli";
import {admin} from "../../lib/ava";
import chalk from "chalk";

export const command = "setLoggerLevel [args]";

export const desc = "Sets log and display levels of loggers.";

export const builder = (yargs: Argv) =>
    yargs.options({
        loggerName: {
            alias: "-ln",
            description: "Logger's name. This is an optional parameter. If not specified, it changes all possible loggers."
        },
        logLevel: {
            alias: "ll",
            description: "Log level.",
            choices: ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "CRIT"]
        },
        displayLevel: {
            alias: "dl",
            description: "Alias for the blockchain id.",
            choices: ["OFF", "FATAL", "ERROR", "INFO", "WARN", "DEBUG", "VERBO"]
        }
    }).check(({logLevel, displayLevel}) => {
        if (!logLevel && !displayLevel) {
            throw new Error('displayLevel or displayLevel option is required');
        }

        return true
    });

export async function handler(args: ArgShape) {
    const {data} = await admin.setLoggerLevel(args);
    if (data.success) {
        console.log(`${chalk.green('Operation performed successfully!')}`);
    } else {
        console.log(`${chalk.red('Error performing setLoggerLevel!')}`);
        console.error('Reason:', data.error.message);
    }
}
