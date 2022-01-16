import { Construct } from "constructs";
import { AvalancheExporterOptions } from "../types";
import * as k from "../../../imports/k8s";

export const deployment = (c: Construct, opts: AvalancheExporterOptions) => {
  return new k.KubeDeployment(c, `ava-exporter-deployment`, {
    metadata: {
      namespace: opts.namespace,
      name: "ava-exporter",
      labels: { app: "ava-exporter" },
    },
    spec: {
      selector: { matchLabels: { app: "ava-exporter" } },
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
            app: "ava-exporter",
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
