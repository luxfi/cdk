import { Construct } from "constructs";
import { NodeExporterOptions } from "../types";
import * as k from "../../../imports/k8s";

export const service = (c: Construct, opts: NodeExporterOptions) => {
  return new k.KubeService(c, "node-exporter-service", {
    metadata: {
      name: "node-exporter",
      namespace: opts.namespace,
      annotations: {
        "prometheus.io/port": "30909",
        "prometheus.io/path": "/metrics",
        "prometheus.io/scrape": "true",
      },
      labels: {
        app: "node-exporter",
        service: "node-exporter-service",
        "app.kubernetes.io/component": "exporter",
        "app.kubernetes.io/name": "node-exporter",
      },
    },
    spec: {
      selector: {
        app: "node-exporter",
        service: "node-exporter-service",
        "app.kubernetes.io/component": "exporter",
        "app.kubernetes.io/name": "node-exporter",
      },
      type: "NodePort",
      ports: [
        {
          name: "node-exporter",
          port: 9100,
          targetPort: k.IntOrString.fromNumber(9100),
          protocol: "TCP",
          nodePort: 30909,
        },
      ],
    },
  });
};

export default service;
