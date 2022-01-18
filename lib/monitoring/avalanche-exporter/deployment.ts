import { Construct } from "constructs";
import { AvalancheExporterOptions } from "../types";
import * as k from "../../../imports/k8s";

export const deployment = (c: Construct, opts: AvalancheExporterOptions) => {
  return new k.KubeDaemonSet(c, `ava-exporter-daemon`, {
    metadata: {
      namespace: opts.namespace,
      name: "ava",
      labels: { app: "avanode" },
    },
    spec: {
      selector: { matchLabels: { app: "avanode" } },
      replicas: opts.deployment.replicas,
      strategy: {
        rollingUpdate: {
          maxSurge: k.IntOrString.fromString("100%"),
          maxUnavailable: k.IntOrString.fromNumber(1),
        },
        type: "RollingUpdate",
      },
      template: {
        metadata: {
          labels: {
            app: "avanode",
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
