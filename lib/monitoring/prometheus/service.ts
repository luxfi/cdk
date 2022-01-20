import { Construct } from "constructs";
import { PrometheusOptions } from "../types";
import * as k from "../../../imports/k8s";

export const service = (c: Construct, opts: PrometheusOptions) => {
  return new k.KubeService(c, "prometheus-service", {
    metadata: {
      name: "prometheus-service",
      namespace: opts.namespace,
      annotations: {
        "prometheus.io/scrape": "true",
        "prometheus.io/port": "9090",
      },
      labels: { app: "prometheus-service" },
    },
    spec: {
      selector: { app: "prometheus-service" },
      type: "ClusterIP",
      ports: [
        {
          name: "prometheus-service",
          protocol: "TCP",
          port: 8080,
          targetPort: k.IntOrString.fromNumber(9090),
        },
      ],
    },
  });
};

export default service;
