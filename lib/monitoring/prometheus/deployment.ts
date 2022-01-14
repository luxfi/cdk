import { Construct } from "constructs";
import { PrometheusOptions } from "../types";
import * as k from "../../../imports/k8s";

export const deployment = (c: Construct, opts: PrometheusOptions) => {
  const initContainers = opts.deployment.useVolumes
    ? [
        // {
        //   name: "prometheus-data-permissions-setup",
        //   image: "busybox",
        //   imagePullPolicy: kplus.ImagePullPolicy.IF_NOT_PRESENT,
        //   command: ["/bin/chmod", "-R", "777", "/prometheus"],
        //   volumeMounts: prometheusVolumeMounts,
        // },
      ]
    : [];

  const containers = [
    {
      image: opts.deployment.image,
      name: "prometheus",
      imagePullPolicy: "ifNotPresent",
      command: ["/usr/bin/prometheus"],
      args: [
        "-storage.local.retention=12h",
        "-storage.local.memory-chunks=500000",
        "-config.file=/etc/prometheus/prometheus.yaml",
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
      volumeMounts: opts.deployment.useVolumes
        ? [
            {
              name: "prometheus-config-volume",
              mountPath: "/etc/prometheus",
            },
            {
              name: "prometheus-rules-volume",
              mountPath: "/etc/prometheus-rules",
            },
          ]
        : [],
    },
  ];

  const spec = Object.assign(
    {},
    {
      selector: { matchLabels: { app: "prometheus" } },
      replicas: opts.deployment.replicas,
      strategy: {
        rollingUpdate: {
          maxSurge: k.IntOrString.fromNumber(1),
          maxUnavailable: k.IntOrString.fromNumber(1),
        },
        type: "RollingUpdate",
      },
      template: {
        metadata: {
          name: "prometheus",
          labels: { app: "prometheus" },
        },
        spec: {
          initContainers,
          containers,
        },
      },
    },
    opts.deployment.useVolumes
      ? {
          volumes: [
            {
              name: "prometheus-config-volume",
              configMap: { name: "prometheus-core" },
            },
            {
              name: "prometheus-rules-volume",
              configMap: { name: "prometheus-rules" },
            },
          ],
        }
      : {}
  );

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
