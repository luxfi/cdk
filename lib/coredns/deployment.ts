import { Construct } from "constructs";
import * as k from "../../../imports/k8s";
import { CoreDNSOptions } from "./types";

export const deployment = (c: Construct, opts: CoreDNSOptions) => {
  const deployment = new k.KubeDeployment(c, `coredns-deployment`, {
    metadata: {
      namespace: opts.namespace,
      name: "coredns",
      labels: {
        "k8s-app": "kube-dns",
        "kubernetes.io/name": "CoreDNS",
      },
    },
    spec: {
      strategy: {
        type: "RollingUpdate",
        rollingUpdate: {
          maxUnavailable: 1,
        },
      },
      selector: {
        matchLabels: {
          "k8s-app": "kube-dns",
        },
      },
      template: {
        metadata: {
          labels: {
            "k8s-app": "kube-dns",
          },
        },
        spec: {
          dnsPolicy: "Default",
          volumes: [
            {
              name: "config-volume",
              configMap: {
                name: "coredns",
                items: [
                  {
                    key: "Corefile",
                    path: "Corefile",
                  },
                  {
                    key: "NodeHosts",
                    path: "NodeHosts",
                  },
                ],
              },
            },
            {
              name: "custom-config-volume",
              configMap: {
                name: "coredns-custom",
                optional: true,
              },
            },
          ],
          priorityClassName: "system-cluster-critical",
          serviceAccountName: "coredns",
          tolerations: [
            { key: "CriticalAddonsOnly", operator: "Exists" },
            {
              key: "node-role.kubernetes.io/control-plane",
              operator: "Exists",
              effect: "NoSchedule",
            },
            {
              key: "node-role.kubernetes.io/master",
              operator: "Exists",
              effect: "NoSchedule",
            },
          ],
          nodeSelector: {
            "beta.kubernetes.io/os": "linux",
          },
          topologySpreadContraints: [
            {
              maxSkew: 1,
              topologyKey: "kubernetes.io/hostname",
              whenUnsatisfiable: "DoNotSchedule",
              labelSelector: {
                matchLabels: { "k8s-app": "kube-dns" },
              },
            },
          ],
          containers: [
            {
              name: "coredns",
              image: "",
              imagePullPolicy: "IfNotPresent",
              args: ["-conf", "/etc/coredns/Corefile"],
              volumeMounts: [
                {
                  name: "config-volume",
                  mountPath: "/etc/coredns",
                  readOnly: true,
                },
                {
                  name: "custom-config-volume",
                  mountPath: "/etc/coredns/custom",
                  readOnly: true,
                },
              ],
              ports: [
                {
                  containerPort: 53,
                  name: "dns",
                  protocol: "UDP",
                },
                {
                  containerPort: 53,
                  name: "dns-tcp",
                  protocol: "TCP",
                },
                {
                  containerPort: 9153,
                  name: "metrics",
                  protocol: "TCP",
                },
              ],
              securityContext: {
                allowPrivilegeEscalation: false,
                capabilities: {
                  add: ["NET_BIND_SERVICE"],
                  drop: ["all"],
                },
                readOnlyRootFilesystem: true,
              },
              livenessProbe: {
                httpGet: {
                  path: "/health",
                  port: k.IntOrString.fromNumber(8080),
                  scheme: "HTTP",
                },
                initialDelaySeconds: 60,
                timeoutSeconds: 1,
                successThreshold: 1,
                failureThreshold: 3,
              },
              readinessProbe: {
                httpGet: {
                  path: "/ready",
                  port: k.IntOrString.fromNumber(8181),
                  scheme: "HTTP",
                },
                initialDelaySeconds: 0,
                periodSeconds: 2,
                timeoutSeconds: 1,
                successThreshold: 1,
                failureThreshold: 3,
              },
              resources: {
                requests: {
                  cpu: k.Quantity.fromString("100m"),
                  memory: k.Quantity.fromString("180Mi"),
                },
                limits: {
                  cpu: k.Quantity.fromString("150m"),
                  memory: k.Quantity.fromString("70Mi"),
                },
              },
            },
          ],
        },
      },
    },
  });

  return { deployment };
};

export default deployment;
