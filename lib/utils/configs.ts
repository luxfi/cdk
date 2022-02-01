require("dotenv").config();
require("dotenv").config({ path: `.env.${process.env.CLUSTER}` });

export const CLUSTER = process.env.CLUSTER;
export const DEBUG = process.env.DEBUG;
export const IS_LOCAL = CLUSTER === "local";
export const ON_CLUSTER = !IS_LOCAL;
export const HOST = IS_LOCAL ? "local" : process.env.HOST;
export const REGISTRY = IS_LOCAL ? "registry.localhost:5000" : "docker.io"
