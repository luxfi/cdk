import { Construct } from "constructs";
// import { Names } from "cdk8s";
// import * as c from "cdk8s";
// import * as k from "../../imports/k8s";
import * as t from "./types";

import namespace from "./namespace";
import rbac from "./rbac";
import serviceAccount from "./service-account";
import prometheusComponent from "./prometheus";
import grafanaComponent from "./grafana";
import nodeExporterComponent from "./node-exporter";

export * from "./types";

export const monitoring = (c: Construct, opts: t.MonitoringOptions) => {
  const options: t.MonitoringOptions = Object.assign(
    {},
    {
      namespace: "monitoring",
    },
    opts
  );
  return {
    namespace: namespace(c, options),
    rbac: rbac(c, options),
    serviceAccount: serviceAccount(c, options),
  };
};

export const prometheus = (c: Construct, options: t.PrometheusOptions) => {
  return prometheusComponent(c, options);
};

export const grafana = (c: Construct, options: t.GrafanaOptions) => {
  return grafanaComponent(c, options);
};

export const nodeExporter = (c: Construct, options: t.NodeExporterOptions) => {
  return nodeExporterComponent(c, options);
};
