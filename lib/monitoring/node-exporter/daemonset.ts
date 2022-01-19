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
              // volumeMounts: [
              //   {
              //     mountPath: "/host/sys",
              //     mountPropagation: "HostToContainer",
              //     name: "sys",
              //     readOnly: true,
              //   },
              //   {
              //     mountPath: "/host/root",
              //     mountPropagation: "HostToContainer",
              //     name: "root",
              //     readOnly: true,
              //   },
              // ],
            },
          ],
          // volumes: [
          //   {
          //     name: "sys",
          //     hostPath: {
          //       path: "/sys",
          //     },
          //   },
          //   {
          //     name: "root",
          //     hostPath: {
          //       path: "/",
          //     },
          //   },
          // ],
        },
      },
    },
  });
};

export default daemonset;
