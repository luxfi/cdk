import { Construct } from "constructs";
import service from "./service";
import daemonset from "./daemonset";
import { NodeExporterOptions } from "../types";

export const nodeExporter = (c: Construct, opts: NodeExporterOptions) => {
  return {
    service: service(c, opts),
    daemonset: daemonset(c, opts),
  };
};

export default nodeExporter;
