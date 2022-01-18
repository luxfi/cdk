import { Construct } from "constructs";
import daemonset from "./daemonset";
import service from "./service";
import { AvalancheExporterOptions } from "../types";

export const avalancheExporter = (
  c: Construct,
  opts: AvalancheExporterOptions
) => {
  return {
    daemonset: daemonset(c, opts),
    service: service(c, opts),
  };
};

export default avalancheExporter;
