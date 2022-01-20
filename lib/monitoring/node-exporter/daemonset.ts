import { Construct } from "constructs";
import { NodeExporterOptions } from "../types";
import * as k from "../../../imports/k8s";

export const daemonset = (c: Construct, opts: NodeExporterOptions) => {
  const daemonset = opts.daemonset || {};
  const matchLabels = daemonset.matchLabels || {};
  // const matchExpressions = daemonset.matchExpressions || {};
  return new k.KubeDaemonSet(c, "node-exporter", {
    metadata: {
      labels: {
        // "app.kubernetes.io/name": "node-exporter",
        app: "node-exporter",
      },
      name: "node-exporter",
      namespace: opts.namespace,
      annotations: {
        "prometheus.io/port": "9001",
        "prometheus.io/path": "/metrics",
        "prometheus.io/scrape": "true",
      },
    },
    spec: {
      selector: {
        matchLabels,
        // matchExpressions,
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
        },
        spec: {
          containers: [
            {
              name: "node-exporter",
              image: "prom/node-exporter",
              ports: [
                { containerPort: 9100, name: "interface", protocol: "TCP" },
              ],
              args: [
                // "--path.procfs",
                // "/host/proc",
                // "--path.sysfs",
                // "/host/sys",
                "--collector.cpu",
                "--collector.diskstats",
                "--collector.filesystem",
                "--collector.loadavg",
                "--collector.uname",
                "--collector.time",
                "--collector.arp",
                "--collector.filesystem.ignored-mount-points",
                '"^/(sys|proc|dev|host|etc)($|/)"',
                "--web.listen-address=:9100",
                '--web.telemetry-path="/metrics"',
              ],

              resources: {
                requests: {
                  cpu: k.Quantity.fromString("50m"),
                  memory: k.Quantity.fromString("128Mi"),
                },
                limits: {
                  cpu: k.Quantity.fromString("100m"),
                  memory: k.Quantity.fromString("128Mi"),
                },
              },
            },
          ],
        },
      },
    },
  });
};

export default daemonset;
