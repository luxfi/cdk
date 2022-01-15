import { Construct } from "constructs";
import service from "./service";
import configMap from "./import-dashboards/configmap";
import job from "./import-dashboards/job";
import deployment from "./deployment";
import secret from "./secret";
import { GrafanaOptions } from "../types";

export const grafanaCore = (c: Construct, opts: GrafanaOptions) => {
  return {
    secret: secret(c, opts),
    service: service(c, opts),
    deployment: deployment(c, opts),
    configMap: configMap(c, opts),
    job: job(c, opts),
  };
};

export default grafanaCore;
