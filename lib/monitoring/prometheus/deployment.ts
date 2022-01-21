import { Construct } from "constructs";
import { PrometheusOptions } from "../types";
import * as k from "../../../imports/k8s";
import volumes from "./volumes";

export const deployment = (c: Construct, opts: PrometheusOptions) => {
  const { prometheusVolumeMounts } = volumes(c, opts);
  const volumeMounts = [
    {
      name: "prometheus-config-volume",
      mountPath: "/etc/prometheus",
      defaultMode: 0o420,
    },
    {
      name: "prometheus-rules-volume",
      mountPath: "/etc/prometheus-rules",
    },
    {
      name: "prometheus-data-volume",
      mountPath: "/usr/share/prometheus",
      // claim: { claimName: storageVolumeClaimName },
    },
  ];
  const initContainers = [
    {
      name: "prometheus-data-permissions-setup",
      image: "busybox",
      imagePullPolicy: "IfNotPresent",
      command: ["/bin/chmod", "-R", "777", "/usr/share/prometheus"],
      volumeMounts: prometheusVolumeMounts,
      securityContext: {
        runAsNonRoot: false,
        privileged: true,
      },
      terminationMessagePath: "/dev/termination-log",
      terminationMessagePolicy: "File",
    },
  ];

  const containers = [
    {
      image: opts.deployment.image,
      name: "prometheus",
      imagePullPolicy: "IfNotPresent",
      command: ["/usr/bin/prometheus"],
      args: [
        "--storage.tsdb.retention.time=2h",
        "--config.file=/etc/prometheus/prometheus.yaml",
        // "--web.config.file=/etc/prometheus/web-config.yaml",
        "--storage.tsdb.path=/usr/share/prometheus",
        "--web.listen-address=0.0.0.0:9090",
        "--web.external-url=http://localhost:9090",
        "--enable-feature=expand-external-labels",
        "--web.enable-admin-api",
      ],
      initialDelaySeconds: 30,
      ports: [{ containerPort: 9090, name: "metrics" }],
      resources: {
        requests: {
          cpu: k.Quantity.fromString("500m"),
          memory: k.Quantity.fromString("500M"),
        },
        limits: {
          cpu: k.Quantity.fromNumber(1),
          memory: k.Quantity.fromString("2Gi"),
        },
      },
      volumeMounts,
    },
  ];

  const spec = {
    selector: { matchLabels: { app: "prometheus-server" } },
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
        labels: { app: "prometheus-server" },
      },
      spec: {
        serviceAccountName: "prometheus",
        // hostname: "prometheus",
        // subdomain: "service",
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
            mountPath: "/usr/share/prometheus",
            // claim: { claimName: storageVolumeClaimName },
          },
        ],
      },
    },
  };

  const deployment = new k.KubeDeployment(c, `prometheus-deployment`, {
    metadata: {
      namespace: opts.namespace,
      name: "prometheus-deployment",
      labels: { app: "prometheus-server" },
      annotations: {
        // "prometheus.io/port": "9090",
        // "prometheus.io/scrape": "false",
      },
    },
    spec,
  });

  return {
    deployment,
    containers,
  };
};

export default deployment;
