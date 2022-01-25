import {Argv} from "yargs";
import {ArgShape} from "@cli";
import {platform} from "../../lib/ava";
import {one_month, ten_minutes} from "../../lib/date";

export const command = "addSubnetValidator [args]";

export const desc = "Add a validator to a subnet";

export const builder = (yargs: Argv) =>
    yargs.options({
        nodeID: {
            type: "string",
            required: true,
        },
        subnetID: {
            type: "string",
            required: true,
        },
        startTime: {
            default: Math.floor(ten_minutes.getTime() / 1000),
        },
        endTime: {
            default: Math.floor(one_month.getTime() / 1000),
        },
        weight: {
            type: "number",
            required: true,
        },
        changeAddr: {
            type: "string",
            default: null,
        },
        username: {
            alias: "u",
            description: "Username for the key",
            required: true,
            help: "Username for the key",
        },
        password: {
            alias: "p",
            description: "Password for the key",
            required: true,
        },
    });

export async function handler(args: ArgShape) {
    delete args["node-i-d"];
    delete args["alias"];

    const resp = await platform.addSubnetValidator(args);
    console.log("resp", resp);
}
