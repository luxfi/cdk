const pkg = require("../../package.json");
const Configstore = require("configstore");
export const conf = new Configstore(pkg.name);
