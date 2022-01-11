export const createDebug = require("debug");
createDebug.formatters.h = (v: Buffer) => v.toString("hex");

export default createDebug;
