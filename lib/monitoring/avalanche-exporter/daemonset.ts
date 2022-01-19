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
      labels: {
        app: "ava-exporter",
        "app.kubernetes.io/component": "exporter",
        "app.kubernetes.io/name": "avanode-exporter",
      },
      annotations: {
        "app.kubernetes.io/scrape": "true",
        "app.kubernetes.io/path": "/metrics",
        "app.kubernetes.io/port": "9001",
      },
    },
    spec: {
      selector: {
        matchLabels,
      },
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
          annotations: {
            "prometheus.io/port": "9001",
            "prometheus.io/path": "/metrics",
            "prometheus.io/scrape": "true",
          },
        },
        spec: {
          containers: [
            {
              name: "ava-exporter",
              image: "quay.io/freshtracks.io/avalanche",
              imagePullPolicy: "IfNotPresent",
              args: ["--metric-count=1000", "--series-count=50", "--port=9001"],
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
