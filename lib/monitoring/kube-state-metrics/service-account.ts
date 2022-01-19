import { Construct } from "constructs";
import * as k from "../../../imports/k8s";
import { KubeStateMetricsOptions } from "../types";

export const serviceAccount = (c: Construct, opts: KubeStateMetricsOptions) => {
  return new k.KubeServiceAccount(c, `kube-state-metrics-service-account`, {
    metadata: {
      namespace: opts.namespace,
      name: "kube-state-metrics",
      labels: {
        "app.kubernetes.io/component": "exporter",
        "app.kubernetes.io/name": "kube-state-metrics",
        "app.kubernetes.io/version": "2.3.0",
      },
    },
  });
};

export default serviceAccount;
