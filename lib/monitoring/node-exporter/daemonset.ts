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
          volumes: [
            {
              hostPath: {
                path: "sys",
              },
              name: "sys",
            },
            {
              hostPath: {
                path: "/",
              },
              name: "root",
            },
          ],
          containers: [
            {
              name: "node-exporter",
              image: "prom/node-exporter",
              ports: [{ containerPort: 9100, protocol: "TCP" }],
              args: [
                "--path.sysfs=/host/sys",
                "--path.rootfs=/host/root",
                "--collector.cpu",
                "--collector.diskstats",
                "--collector.filesystem",
                "--collector.loadavg",
                "--collector.uname",
                "--collector.time",
                "--collector.arp",
                "--no-collector.wifi",
                "--no-collector.hwmon",
                "--collector.filesystem.ignored-mount-points=^/(dev|proc|sys|var/lib/docker/.+|var/lib/kubelet/pods/.+)($|/)",
                "--collector.netclass.ignored-devices=^(veth.*)$",
                // "--web.listen-address=:9100",
                // '--web.telemetry-path="/metrics"',
              ],

              resources: {
                requests: {
                  cpu: k.Quantity.fromString("105m"),
                  memory: k.Quantity.fromString("180Mi"),
                },
                limits: {
                  cpu: k.Quantity.fromString("250m"),
                  memory: k.Quantity.fromString("180Mi"),
                },
              },
              volumeMounts: [
                {
                  mountPath: "/host/sys",
                  // mountPropagation: "HostToContainer",
                  name: "sys",
                  readOnly: true,
                },
                {
                  mountPath: "/host/root",
                  // mountPropagation: "HostToContainer",
                  name: "root",
                  readOnly: true,
                },
              ],
            },
          ],
        },
      },
    },
  });
};

export default daemonset;
