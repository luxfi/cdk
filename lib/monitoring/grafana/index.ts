import { Construct } from "constructs";
import service from "./service";
// import configMap from "./import-dashboards/configmap";
import configMap from "./configmap";
import job from "./import-dashboards/job";
import deployment from "./deployment";
import secret from "./secret";
import ingress from "./ingress";
import { GrafanaOptions } from "../types";

export const grafanaCore = (c: Construct, opts: GrafanaOptions) => {
  return {
    secret: secret(c, opts),
    service: service(c, opts),
    configMap: configMap(c, opts),
    deployment: deployment(c, opts),
    job: job(c, opts),
    ingress: ingress(c, opts),
  };
};

export default grafanaCore;
