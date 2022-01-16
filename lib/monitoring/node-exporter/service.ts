import { Construct } from "constructs";
import { NodeExporterOptions } from "../types";
import * as k from "../../../imports/k8s";

export const service = (c: Construct, opts: NodeExporterOptions) => {
  return new k.KubeService(c, "node-exporter-service", {
    metadata: {
      name: "node-exporter",
      namespace: opts.namespace,
      annotations: {
        "prometheus.io/scrape": "true",
        "prometheus.io/port": "9100",
      },
    },
    spec: {
      selector: {
        "app.kubernetes.io/name": "node-exporter",
      },
      ports: [
        {
          name: "node-exporter",
          protocol: "TCP",
          port: 9100,
          targetPort: k.IntOrString.fromNumber(9100),
        },
      ],
    },
  });
};

export default service;
