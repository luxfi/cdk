import { Construct } from "constructs";
import { PrometheusOptions } from "../types";
import * as k from "../../../imports/k8s";

export const service = (c: Construct, opts: PrometheusOptions) => {
  return new k.KubeService(c, "prometheus-service", {
    metadata: {
      name: "prometheus",
      namespace: opts.namespace,
      annotations: {
        "prometheus.io/scrape": "true",
        "prometheus.io/port": "9090",
      },
      labels: { app: "prometheus" },
    },
    spec: {
      selector: { app: "prometheus" },
      ports: [
        {
          port: 9090,
          protocol: "TCP",
          name: "webui",
          nodePort: 30909,
          targetPort: k.IntOrString.fromNumber(9090),
        },
      ],
      type: `LoadBalancer`,
    },
  });
};

export default service;
