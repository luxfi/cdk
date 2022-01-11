const pkg = require("../../package.json");
// const Configstore = require("configstore");
// export const conf = new Configstore(pkg.name);

export const today = new Date();
export const yesterday = new Date(today.setDate(today.getDate() - 1));
export const last_year = new Date(today.setDate(today.getDate() - 365));
export const next_year = new Date(today.setDate(today.getDate() + 365));
