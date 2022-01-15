import { Construct } from "constructs";
import { GrafanaOptions } from "../types";
import * as k from "../../../imports/k8s";

export const deployment = (c: Construct, opts: GrafanaOptions) => {
  const initContainers: any[] = [];

  const containers: any[] = [
    {
      image: opts.deployment.image,
      name: "grafana",
      imagePullPolicy: "IfNotPresent",
      command: ["/usr/sbin/grafana-server"],
      args: [],
      ports: [{ containerPort: 9090 }],
      resources: {
        requests: {
          cpu: k.Quantity.fromString("100m"),
          memory: k.Quantity.fromString("100Mi"),
        },
        limits: {
          cpu: k.Quantity.fromString("100m"),
          memory: k.Quantity.fromString("100Mi"),
        },
      },
      env: [
        {
          name: "GF_AUTH_BASIC_ENABLED",
          value: "true",
        },
        {
          name: "GF_SECURITY_ADMIN_USER",
          valueFrom: {
            secretKeyRef: {
              name: "grafana",
              key: "admin-password",
            },
          },
        },
        {
          name: "GF_AUTH_ANONYMOUS_ENABLED",
          value: "false",
        },
      ],
      readinessProbe: {
        httpGet: {
          path: "/login",
          port: k.IntOrString.fromNumber(3000),
        },
      },
      volumeMounts: [
        {
          name: "grafana-data-storage",
          mountPath: "/var/lib/grafana",
        },
      ],
    },
  ];

  const spec = {
    selector: { matchLabels: { app: "grafana" } },
    replicas: opts.deployment.replicas,
    strategy: {
      rollingUpdate: {
        maxSurge: k.IntOrString.fromNumber(1),
        maxUnavailable: k.IntOrString.fromNumber(1),
      },
      type: "RollingUpdate",
    },
    securityContext: {
      // fsGroup: 2000,
      // runAsUser: 1000,
      // runAsNonRoot: true,
    },
    template: {
      metadata: {
        name: "grafana",
        labels: { app: "grafana" },
      },
      spec: {
        serviceAccountName: "grafana",
        initContainers,
        containers,
        volumes: [
          {
            name: "grafana-data-storage",
            emptyDir: {},
            // claim: { claimName: storageVolumeClaimName },
          },
        ],
      },
    },
  };

  return new k.KubeDeployment(c, `grafana-deployment`, {
    metadata: {
      namespace: opts.namespace,
      name: "grafana-deployment",
      labels: { app: "grafana-server" },
    },
    spec,
  });
};

export default deployment;
