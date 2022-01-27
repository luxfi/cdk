import { Construct } from "constructs";
import service from "./service";
import rules from "./rules";
import configMap from "./configmap";
import deployment from "./deployment";
import secret from "./secret";
import ingress from "./ingress";
import rbac from "./rbac";
import operator from "./prometheus-operator";
import { PrometheusOptions } from "../types";

export const prometheusCore = (c: Construct, opts: PrometheusOptions) => {
  return {
    secret: secret(c, opts),
    rbac: rbac(c, opts),
    service: service(c, opts),
    rules: rules(c, opts),
    configMap: configMap(c, opts),
    deployment: deployment(c, opts),
    operator: operator(c, opts),
    ingress: ingress(c, opts),
  };
};

export default prometheusCore;