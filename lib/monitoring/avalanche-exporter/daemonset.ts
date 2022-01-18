import { Construct } from "constructs";
import { AvalancheExporterOptions } from "../types";
import * as k from "../../../imports/k8s";

export const deployment = (c: Construct, opts: AvalancheExporterOptions) => {
  const daemonset = opts.daemonset || {};
  const matchLabels = daemonset.matchLabels || {};

  return new k.KubeDaemonSet(c, `ava-exporter-daemon`, {
    metadata: {
      namespace: opts.namespace,
      name: "ava-exporter",
      labels: { app: "avanode" },
    },
    spec: {
      selector: {
        matchLabels,
        // matchExpressions,
      },
      // replicas: opts.deployment.replicas,
      updateStrategy: {
        type: "RollingUpdate",
        rollingUpdate: {
          maxUnavailable: k.IntOrString.fromNumber(1),
        },
      },
      template: {
        metadata: {
          labels: {
            ...matchLabels,
          },
        },
        spec: {
          containers: [
            {
              name: "ava-exporter",
              image: "quay.io/freshtracks.io/avalanche",
              imagePullPolicy: "IfNotPresent",
              args: [
                "--metric-count=1000",
                "--series-count=50",
                "--port=9001",
                "--label-count=50",
                "--value-interval=15",
              ],
              ports: [
                {
                  containerPort: 9001,
                  protocol: "TCP",
                  name: "ava-metrics",
                },
              ],
            },
          ],
        },
      },
    },
  });
};

export default deployment;
