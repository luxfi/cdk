import {Argv} from "yargs";
import {ArgShape} from "../../cli";
import {admin} from "../../lib/ava";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import Table from "cli-table";

export const command = "getLoggerLevel [args]";

export const desc = "Get log and display levels of loggers.";

export const builder = (yargs: Argv) =>
    yargs.options({
        loggerName: {
            alias: "l",
            description: "Name of the logger to be returned."
        }
    });

export async function handler(args: ArgShape) {
    const {data} = await admin.getLoggerLevel(args);
    if (data?.loggerLevels) {
        clear();
        console.log(
            chalk.yellow(figlet.textSync("loggerLevels", { horizontalLayout: "full" }))
        );
        const loggerTable = new Table({
            head: ["Log Name", "Log Level", "Display Level"],
        });
        for (const key in data.loggerLevels) {
            loggerTable.push([key, data.loggerLevels[key].logLevel, data.loggerLevels[key].displayLevel]);
        }
        console.log(loggerTable.toString());
    } else {
        console.log(`${chalk.red('Error getting logger levels for this chain!')}`);
        console.error('Reason:', data.error.message);
    }
}
