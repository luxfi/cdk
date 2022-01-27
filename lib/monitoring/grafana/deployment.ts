import { Construct } from "constructs";
import { GrafanaOptions } from "../types";
import * as k from "../../../imports/k8s";

export const deployment = (c: Construct, opts: GrafanaOptions) => {
  const initContainers: any[] = [
    {
      name: "grafana-data-permissions-setup",
      image: "busybox",
      imagePullPolicy: "IfNotPresent",
      command: ["/bin/chmod", "-R", "777", "/var/lib/grafana"],
      volumeMounts: [
        {
          name: "grafana-data-storage",
          mountPath: "/var/lib/grafana",
        },
      ],
      securityContext: {
        runAsNonRoot: false,
        privileged: true,
      },
      terminationMessagePath: "/dev/termination-log",
      terminationMessagePolicy: "File",
    },
  ];

  const containers: any[] = [
    {
      image: "grafana/grafana-oss:latest",
      name: "grafana",
      imagePullPolicy: "IfNotPresent",
      // workingDir: "/usr/share/grafana/",
      // command: ["grafana-server"],
      args: [
        // "-homepath='/usr/share/grafana'",
        // "-config='/usr/share/grafana/conf/defaults.ini'",
      ],
      ports: [{ containerPort: 3000 }],
      resources: {
        requests: {
          cpu: k.Quantity.fromString("50m"),
          memory: k.Quantity.fromString("100Mi"),
        },
        limits: {
          cpu: k.Quantity.fromString("50m"),
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
        {
          name: "grafana-dashboards",
          mountPath: "/etc/grafana/dashboards",
        },
        {
          name: "grafana-provision-avalanche",
          mountPath: "/etc/grafana/provisioning/dashboards",
        },
        {
          name: "grafana-provision-datasources",
          mountPath: "/etc/grafana/provisioning/datasources",
        },
        {
          name: "grafana-secret-volume",
          readOnly: true,
          mountPath: "/var/run/secrets/grafana.lux",
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
          {
            name: "grafana-dashboards",
            configMap: { name: "grafana-dashboards" },
          },
          {
            name: "grafana-provision-avalanche",
            configMap: { name: "grafana-provision-avalanche" },
          },
          {
            name: "grafana-provision-datasources",
            configMap: { name: "grafana-provision-datasources" },
          },
          {
            name: "grafana-secret-volume",
            secret: {
              secretName: "grafana-tls-secret",
            },
          },
        ],
      },
    },
  };

  return new k.KubeDeployment(c, `grafana-deployment`, {
    metadata: {
      namespace: opts.namespace,
      name: "grafana-deployment",
      labels: { app: "grafana" },
    },
    spec,
  });
};

export default deployment;
