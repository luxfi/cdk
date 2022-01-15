import * as path from "path";

export * from "./files";

export const baseDirectory = path.join(__dirname, "..");
export const configsDirectory = path.join(baseDirectory, "configs");
export const promethusConfigsDirectory = path.join(
  configsDirectory,
  "prometheus"
);
export const grafanaConfigsDirectory = path.join(configsDirectory, "grafana");
