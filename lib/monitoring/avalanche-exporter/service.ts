import { Construct } from "constructs";
import { AvalancheExporterOptions } from "../types";
import * as k from "../../../imports/k8s";

export const service = (c: Construct, opts: AvalancheExporterOptions) => {
  return new k.KubeService(c, "ava-exporter-service", {
    metadata: {
      name: "ava-exporter",
      namespace: opts.namespace,
      annotations: {
        "prometheus.io/port": "9001",
        "prometheus.io/path": "/metrics",
        "prometheus.io/scrape": "true",
      },
      labels: {
        service: "ava-exporter-service",
        app: "ava-exporter",
      },
    },
    spec: {
      selector: { app: "ava-exporter", service: "ava-exporter-service" },
      ports: [
        {
          port: 9001,
          targetPort: k.IntOrString.fromNumber(9001),
          name: "http-exporter",
        },
      ],
      type: `ClusterIP`,
    },
  });
};

export default service;
