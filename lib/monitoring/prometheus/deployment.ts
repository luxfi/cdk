import { Construct } from "constructs";
import { PrometheusOptions } from "../types";
import * as k from "../../../imports/k8s";
import volumes from "./volumes";

export const deployment = (c: Construct, opts: PrometheusOptions) => {
  const {} = volumes(c, opts);
  const volumeMounts = [
    {
      name: "prometheus-config-volume",
      mountPath: "/etc/prometheus",
    },
    {
      name: "prometheus-rules-volume",
      mountPath: "/etc/prometheus-rules",
    },
    {
      name: "prometheus-data-volume",
      mountPath: "/prometheus",
      // claim: { claimName: storageVolumeClaimName },
    },
  ];
  const initContainers = [
    {
      name: "prometheus-data-permissions-setup",
      image: "busybox",
      imagePullPolicy: "IfNotPresent",
      command: ["/bin/chmod", "-R", "777", "/data"],
      volumeMounts: [
        {
          name: "prometheus-data-volume",
          mountPath: "/data",
        },
      ],
    },
  ];

  const containers = [
    {
      image: opts.deployment.image,
      name: "prometheus",
      imagePullPolicy: "IfNotPresent",
      command: ["/usr/bin/prometheus"],
      args: [
        "--storage.tsdb.retention.time=12h",
        "--storage.tsdb.retention.size=5MB",
        "--config.file=/etc/prometheus/prometheus.yaml",
        "--storage.tsdb.path=/prometheus/",
      ],
      ports: [{ containerPort: 9090 }],
      resources: {
        requests: {
          cpu: k.Quantity.fromString("500m"),
          memory: k.Quantity.fromString("500M"),
        },
        limits: {
          cpu: k.Quantity.fromString("500m"),
          memory: k.Quantity.fromString("500M"),
        },
      },
      volumeMounts,
    },
  ];

  const spec = {
    selector: { matchLabels: { app: "prometheus" } },
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
        name: "prometheus",
        labels: { app: "prometheus" },
      },
      spec: {
        initContainers,
        containers,
        volumes: [
          {
            name: "prometheus-config-volume",
            configMap: { name: "prometheus-core" },
          },
          {
            name: "prometheus-rules-volume",
            configMap: { name: "prometheus-rules" },
          },
          {
            name: "prometheus-data-volume",
            mountPath: "/prometheus",
            // claim: { claimName: storageVolumeClaimName },
          },
        ],
      },
    },
  };

  return new k.KubeDeployment(c, `prometheus-deployment`, {
    metadata: {
      namespace: opts.namespace,
      name: "prometheus-deployment",
      labels: { app: "prometheus-server" },
    },
    spec,
  });
};

export default deployment;