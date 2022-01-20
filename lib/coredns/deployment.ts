import { Construct } from "constructs";
import { CoreDNSOptions } from "./types";
import * as k from "../../imports/k8s";

export const deployment = (c: Construct, opts: CoreDNSOptions) => {
  const initContainers: any[] = [];

  const containers: any[] = [
    {
      image: "coredns/coredns:1.8.6",
      name: "coredns",
      imagePullPolicy: "IfNotPresent",
      securityContext: {
        allowPrivilegeEscalation: false,
        capabilities: {
          add: ["NET_BIND_SERVICE"],
          drop: ["all"],
        },
        readonlyRootFilesystem: true,
      },
      ports: [
        { containerPort: 53, name: "dns", protocol: "UDP" },
        { containerPort: 53, name: "dns-tcp", protocol: "TCP" },
        { containerPort: 9153, name: "metrics", protocol: "TCP" },
      ],
      resources: {
        requests: {
          cpu: k.Quantity.fromString("100m"),
          memory: k.Quantity.fromString("70Mi"),
        },
        limits: {
          cpu: k.Quantity.fromString("100m"),
          memory: k.Quantity.fromString("170Mi"),
        },
      },
      args: ["-conf", "/etc/coredns/Corefile"],
      readinessProbe: {
        httpGet: {
          path: "/ready",
          port: k.IntOrString.fromNumber(8181),
          scheme: "HTTP",
        },
      },
      livenessProbe: {
        httpGet: {
          path: "/health",
          port: k.IntOrString.fromNumber(8080),
          scheme: "HTTP",
        },
        initialDelaySeconds: 60,
        timeoutSeconds: 5,
        successThreshold: 1,
        failureThreshold: 5,
      },
      volumeMounts: [
        {
          name: "coredns-corefile",
          mountPath: "/etc/coredns",
          readOnly: true,
        },
      ],
    },
  ];

  const spec = {
    selector: { matchLabels: { "k8s-app": "kube-dns" } },
    strategy: {
      rollingUpdate: {
        maxUnavailable: k.IntOrString.fromNumber(1),
      },
      type: "RollingUpdate",
    },
    template: {
      metadata: {
        labels: { "k8s-app": "kube-dns" },
      },
      spec: {
        priorityClassName: "system-cluster-critical",
        serviceAccountName: "coredns",
        tolerations: [
          {
            key: "CriticalAddonsOnly",
            operator: "Exists",
          },
        ],
        nodeSelector: {
          "kubernetes.io/os": "linux",
        },
        affinity: {
          podAntiAffinity: {
            requiredDuringSchedulingIgnoredDuringExecution: [
              {
                labelSelector: {
                  matchExpressions: [
                    {
                      key: "k8s-app",
                      operator: "In",
                      values: ["kube-dns"],
                    },
                  ],
                },
                topologyKey: "kubernetes.io/hostname",
              },
            ],
          },
        },
        initContainers,
        containers,
        dnsPolicy: "Default",
        volumes: [
          {
            name: "coredns-corefile",
            configMap: {
              name: "coredns-corefile",
              items: [{ key: "Corefile", path: "Corefile" }],
            },
          },
        ],
      },
    },
  };

  return new k.KubeDeployment(c, `coredns-deployment`, {
    metadata: {
      namespace: opts.namespace,
      name: "coredns",
      labels: { "k8s-app": "kube-dns", "kubernetes.io/name": "CoreDNS" },
    },
    spec,
  });
};

export default deployment;
