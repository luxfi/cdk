import { Construct } from "constructs";
import { NodeExporterOptions } from "../types";
import * as k from "../../../imports/k8s";

export const daemonset = (c: Construct, opts: NodeExporterOptions) => {
  return new k.KubeDaemonSet(c, "node-exporter-daemon", {
    metadata: {
      labels: {
        "app.kubernetes.io/name": "node-exporter",
        app: "node-exporter",
      },
      name: "node-exporter",
      namespace: opts.namespace,
    },
    spec: {
      selector: {
        matchLabels: {
          "app.kubernetes.io/name": "node-exporter",
        },
      },
      template: {
        metadata: {
          labels: {
            "app.kubernetes.io/name": "node-exporter",
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
              resources: {
                requests: {
                  cpu: k.Quantity.fromString("100m"),
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
                  mountPropagation: "HostToContainer",
                  name: "sys",
                  readOnly: true,
                },
                {
                  mountPath: "/host/root",
                  mountPropagation: "HostToContainer",
                  name: "root",
                  readOnly: true,
                },
              ],
            },
          ],
          volumes: [
            {
              name: "sys",
              hostPath: {
                path: "/sys",
              },
            },
            {
              name: "root",
              hostPath: {
                path: "/",
              },
            },
          ],
        },
      },
    },
  });
};

export default daemonset;
