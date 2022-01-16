import { Construct } from "constructs";
import deployment from "./deployment";
import service from "./service";
import { AvalancheExporterOptions } from "../types";

export const avalancheExporter = (
  c: Construct,
  opts: AvalancheExporterOptions
) => {
  return {
    deployment: deployment(c, opts),
    service: service(c, opts),
  };
};

export default avalancheExporter;
