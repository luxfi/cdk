require("dotenv").config();
require("dotenv").config({ path: `.env.${process.env.CLUSTER}` });

export const CLUSTER = process.env.CLUSTER;
export const DEBUG = process.env.DEBUG;
export const IS_LOCAL = CLUSTER === "local";
export const HOST = IS_LOCAL ? "minikube.local" : process.env.HOST;
