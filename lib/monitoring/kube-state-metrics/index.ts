import { Construct } from "constructs";
import service from "./service";
import serviceAccount from "./service-account";
import deployment from "./deployment";
import rbac from "./rbac";
import { KubeStateMetricsOptions } from "../types";

export const kubeStateMetrics = (
  c: Construct,
  opts: KubeStateMetricsOptions
) => {
  return {
    service: service(c, opts),
    serviceAccount: serviceAccount(c, opts),
    rbac: rbac(c, opts),
    deployment: deployment(c, opts),
  };
};

export default kubeStateMetrics;
