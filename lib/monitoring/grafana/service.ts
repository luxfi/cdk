import { Construct } from "constructs";
import { GrafanaOptions } from "../types";
import * as k from "../../../imports/k8s";

export const service = (c: Construct, opts: GrafanaOptions) => {
  return new k.KubeService(c, "grafana-service", {
    metadata: {
      name: "grafana-service",
      namespace: opts.namespace,
      labels: { app: "grafana-service" },
    },
    spec: {
      selector: { app: "grafana-service" },
      ports: [
        {
          port: 3000,
        },
      ],
      type: `NodePort`,
    },
  });
};

export default service;
