import { Construct } from "constructs";
import * as k from "../../../imports/k8s";
import { KubeStateMetricsOptions } from "../types";

export const deployment = (c: Construct, opts: KubeStateMetricsOptions) => {
  const deployment = new k.KubeDeployment(c, `kube-state-metrics-deployment`, {
    metadata: {
      namespace: opts.namespace,
      name: "kube-state-metrics",
      labels: {
        app: "kube-state-metrics-deployment",
        "app.kubernetes.io/component": "exporter",
        "app.kubernetes.io/name": "kube-state-metrics",
        "app.kubernetes.io/version": "2.3.0",
      },
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          "app.kubernetes.io/name": "kube-state-metrics",
        },
      },
      template: {
        metadata: {
          labels: {
            "app.kubernetes.io/name": "kube-state-metrics",
            "app.kubernetes.io/component": "exporter",
          },
        },
        spec: {
          serviceAccountName: "kube-state-metrics",
          containers: [
            {
              name: "kube-state-metrics",
              image: "k8s.gcr.io/kube-state-metrics/kube-state-metrics:v2.3.0",
              livenessProbe: {
                httpGet: {
                  path: "/healthz",
                  port: k.IntOrString.fromNumber(8080),
                },
                initialDelaySeconds: 5,
                timeoutSeconds: 5,
              },
              readinessProbe: {
                httpGet: {
                  path: "/",
                  port: k.IntOrString.fromNumber(8081),
                },
                initialDelaySeconds: 5,
                timeoutSeconds: 5,
              },
              securityContext: {
                runAsUser: 65534,
              },
              resources: {
                requests: {
                  cpu: k.Quantity.fromString("50m"),
                  memory: k.Quantity.fromString("500M"),
                },
                limits: {
                  cpu: k.Quantity.fromString("50m"),
                  memory: k.Quantity.fromString("500M"),
                },
              },
              ports: [
                {
                  containerPort: 8080,
                  name: "http-metrics",
                },
                {
                  containerPort: 8081,
                  name: "telemetry",
                },
              ],
            },
          ],
        },
      },
    },
  });

  return { deployment };
};

export default deployment;
