import { Construct } from "constructs";
import { GrafanaOptions } from "../types";
import * as k from "../../../imports/k8s";
import { HOST, IS_LOCAL } from "../../utils";

export const deployment = (c: Construct, opts: GrafanaOptions) => {
  const host = IS_LOCAL ? "localhost": `grafana.${HOST}`;
  // @ts-ignore
  const containers: any[] = [
    {
      // image: "grafana/grafana-oss:latest",
      image: opts.deployment.image,
      name: "grafana",
      imagePullPolicy: "IfNotPresent",
      workingDir: "/var/local/grafana",
      command: ["/usr/sbin/grafana-server"],
      args: [
        "-homepath=/usr/share/grafana",
        "-config=/usr/share/grafana/conf/defaults.ini",
      ],
      securityContext: {
        runAsUser: 100,
        runAsGroup: 101,
        fsGroup: 101,
      },
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
        {
          name: "HOST",
          value: host
        }
      ],
      readinessProbe: {
        httpGet: {
          scheme: "HTTPS",
          path: "/login",
          port: k.IntOrString.fromNumber(3000),
        },
      },
      volumeMounts: [
        {
          name: "grafana-data-storage",
          mountPath: "/var/local/grafana",
        },
        {
          name: "grafana-dashboards",
          mountPath: "/usr/share/grafana/conf/provisioning/dashboards",
        },
        {
          name: "ava-dashboards",
          mountPath: "/usr/share/grafana/conf/provisioning/dashboards/avalanche"
        },
        // {
        //   name: "grafana-provision-avalanche",
        //   // mountPath: "/etc/grafana/dashboards",
        //   mountPath:
        //     "/usr/share/grafana/conf/provisioning/dashboards/avalanche",
        // },
        {
          name: "grafana-plugins",
          mountPath: "/usr/share/grafana/conf/provisioning/plugins",
        },
        {
          name: "grafana-notifiers",
          mountPath: "/usr/share/grafana/conf/provisioning/notifiers",
        },
        {
          name: "grafana-provision-datasources",
          mountPath: "/usr/share/grafana/conf/provisioning/datasources",
        },
        {
          name: "grafana-secret-volume",
          readOnly: true,
          mountPath: "/var/run/secrets/grafana.lux",
        },
        {
          name: "grafana-config-volume",
          mountPath: "/usr/share/grafana/conf/",
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
      fsGroup: 101,
      runAsUser: 101,
      runAsNonRoot: true,
    },
    template: {
      metadata: {
        name: "grafana",
        labels: { app: "grafana" },
      },
      spec: {
        serviceAccountName: "grafana",
        // initContainers,
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
            name: "ava-dashboards",
            configMap: { name: "ava-dashboards" }
          },
          {
            name: "grafana-plugins",
            configMap: { name: "grafana-plugins" },
          },
          {
            name: "grafana-notifiers",
            configMap: { name: "grafana-notifiers" },
          },
          // {
          //   name: "grafana-provision-avalanche",
          //   configMap: { name: "grafana-provision-avalanche" },
          // },
          {
            name: "grafana-provision-datasources",
            configMap: { name: "grafana-provision-datasources" },
          },
          {
            name: "grafana-config-volume",
            configMap: { name: "grafana-configmap" },
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
