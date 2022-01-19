import { Construct } from "constructs";
import * as k from "../../../imports/k8s";
import { KubeStateMetricsOptions } from "../types";

export const service = (c: Construct, opts: KubeStateMetricsOptions) => {
  return new k.KubeService(c, "kube-state-metrics-service", {
    metadata: {
      name: "kube-state-metrics",
      namespace: opts.namespace,
      labels: {
        "app.kubernetes.io/component": "exporter",
        "app.kubernetes.io/name": "kube-state-metrics",
        "app.kubernetes.io/version": "2.3.0",
      },
    },
    spec: {
      selector: { "app.kubernetes.io/name": "kube-state-metrics" },
      clusterIp: "None",
      ports: [
        {
          name: "http-metrics",
          port: 8080,
          targetPort: k.IntOrString.fromString("http-metrics"),
        },
        {
          name: "telemetry",
          port: 8081,
          targetPort: k.IntOrString.fromString("telemetry"),
        },
      ],
    },
  });
};
export default service;
