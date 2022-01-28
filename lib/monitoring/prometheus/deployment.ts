import { Construct } from "constructs";
import { PrometheusOptions } from "../types";
import * as k from "../../../imports/k8s";
// import volumes from "./volumes";

export const deployment = (c: Construct, opts: PrometheusOptions) => {
  // const { prometheusVolumeMounts } = volumes(c, opts);
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
    {
      name: "prometheus-secret-volume",
      readOnly: true,
      mountPath: "/var/run/secrets/prometheus.lux",
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
        "--config.file=/etc/prometheus/prometheus.yaml",
        "--storage.tsdb.path=/usr/share/prometheus",
        "--web.config.file=/etc/prometheus/web-config.yaml",
        "--web.listen-address=0.0.0.0:9090",
        // "--web.listen-address=127.0.0.1:9090",
      ],
      securityContext: {
        runAsUser: 101,
        runAsGroup: 102,
        fsGroup: 102,
      },
      initialDelaySeconds: 5,
      ports: [
        { name: "prometheus", containerPort: 9090, targetPort: 9090 },
        // { containerPort: 9090, name: "metrics" },
      ],
      readinessProbe: {
        httpGet: {
          scheme: "HTTPS",
          path: "/-/ready",
          port: k.IntOrString.fromNumber(9090),
        },
        initialDelaySeconds: 30,
        timeoutSeconds: 30,
      },
      livenessProbe: {
        httpGet: {
          scheme: "HTTPS",
          path: "/-/healthy",
          port: k.IntOrString.fromNumber(9090),
        },
        initialDelaySeconds: 30,
        timeoutSeconds: 30,
      },
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
    serviceName: "prometheus-service",
    replicas: opts.deployment.replicas,
    podManagementPolicy: "Parallel",
    strategy: {
      rollingUpdate: {
        maxSurge: k.IntOrString.fromString("25%"),
        maxUnavailable: k.IntOrString.fromString("25%"),
      },
      type: "RollingUpdate",
    },
    dnsPolicy: "ClusterFirst",
    securityContext: {
      fsGroup: 102,
      runAsUser: 101,
      runAsNonRoot: true,
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
        // initContainers,
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
          },
          {
            name: "prometheus-secret-volume",
            secret: {
              secretName: "prometheus-tls-secret",
            },
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
