import { Construct } from "constructs";
import { AvalancheExporterOptions } from "../types";
import * as k from "../../../imports/k8s";

export const service = (c: Construct, opts: AvalancheExporterOptions) => {
  return new k.KubeService(c, "ava-exporter-service", {
    metadata: {
      name: "ava-exporter",
      namespace: opts.namespace,
      annotations: {
        app: "ava-exporter",
      },
      labels: {
        app: "ava-exporter",
      },
    },
    spec: {
      selector: { app: "ava-exporter" },
      ports: [
        {
          port: 9001,
          nodePort: 31230,
          targetPort: k.IntOrString.fromNumber(9001),
          name: "http-ava-exporter",
        },
      ],
      type: `NodePort`,
      // clusterIp: "None",
    },
  });
};

export default service;
