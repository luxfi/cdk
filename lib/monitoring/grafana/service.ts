import { Construct } from "constructs";
import { GrafanaOptions } from "../types";
import * as k from "../../../imports/k8s";

export const service = (c: Construct, opts: GrafanaOptions) => {
  new k.KubeService(c, "grafana-service", {
    metadata: {
      name: "grafana-service",
      namespace: opts.namespace,
      labels: { app: "grafana" },
    },
    spec: {
      selector: { app: "grafana" },
      type: "NodePort",
      ports: [
        {
          name: "grafana",
          protocol: "TCP",
          port: 3000,
        },
      ],
    },
  });
  // Outside
  new k.KubeService(c, "grafana-lb-service", {
    metadata: {
      name: "grafana-lb-service",
      namespace: opts.namespace,
      labels: { app: "grafana" },
    },
    spec: {
      selector: { app: "grafana" },
      type: "LoadBalancer",
      externalTrafficPolicy: "Cluster",
      ports: [
        {
          name: "grafana",
          port: 443,
          targetPort: k.IntOrString.fromNumber(3000),
        },
      ],
    },
  });
};

export default service;
