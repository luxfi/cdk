import * as path from "path";

export * from "./files";
export * from "./configs";

export const baseDirectory = path.join(__dirname, "..");
export const monitoringConfigsDirectory = path.join(
  baseDirectory,
  "monitoring",
  "configs"
);
export const corednsConfigsDirectory = path.join(
  baseDirectory,
  "coredns",
  "configs"
);

export const promethusConfigsDirectory = path.join(
  monitoringConfigsDirectory,
  "prometheus"
);
export const grafanaConfigsDirectory = path.join(
  monitoringConfigsDirectory,
  "grafana"
);
