import { Construct } from "constructs";
import service from "./service";
import rules from "./rules";
// import volumes from "./volumes";
import configMap from "./configmap";
import deployment from "./deployment";
import secret from "./secret";
import { PrometheusOptions } from "../types";

export const prometheusCore = (c: Construct, opts: PrometheusOptions) => {
  return {
    secret: secret(c, opts),
    service: service(c, opts),
    rules: rules(c, opts),
    // volumes: volumes(c, opts),
    configMap: configMap(c, opts),
    deployment: deployment(c, opts),
  };
};

export default prometheusCore;
