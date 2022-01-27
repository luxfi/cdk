import { Construct } from "constructs";
import { PrometheusOptions } from "../types";
import * as k from "../../../imports/k8s";
// import volumes from "./volumes";

export const operatorDeployment = (c: Construct, opts: PrometheusOptions) => {
  const deployment = new k.KubeDeployment(c, `prometheus-operator-deployment`, {
    metadata: {
      namespace: opts.namespace,
      name: "prometheus-operator-deployment",
      labels: { app: "prometheus-operator" },
    },
    spec: {
      // securityContext: { runAsNonRoot: true, runAsUser: 65534 },
      replicas: opts.deployment.replicas,
      selector: { matchLabels: { app: "prometheus-operator" } },
      // selector: {
      //   labels: { app: "prometheus-operator" },
      // },
      template: {
        metadata: {
          labels: {
            app: "prometheus-operator",
          },
        },
        spec: {
          automountServiceAccountToken: true,
          // nodeSelector: { "kubernetes.io/os": "Linux" },
          serviceAccountName: "prometheus-operator",
          securityContext: {
            // allowPrivilegeEscalation: false,
            runAsGroup: 65532,
            runAsNonRoot: true,
            runAsUser: 65532,
          },
          containers: [
            {
              name: "prometheus-operator",
              ports: [{ containerPort: 8080, name: "http" }],
              args: [
                "--prometheus-config-reloader=quay.io/prometheus-operator/prometheus-config-reloader:v0.53.1",
                "--kubelet-service=kube-system/kubelet",
              ],
              image: "quay.io/prometheus-operator/prometheus-operator:v0.53.1",
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
              securityContext: {
                allowPrivilegeEscalation: false,
              },
            },
            {
              name: "kube-rbac-proxy",
              image: "quay.io/brancz/kube-rbac-proxy:v0.11.0",
              args: [
                "--logtostderr",
                "--secure-listen-address=:8443",
                "--tls-cipher-suites=TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305",
                "--upstream=http://127.0.0.1:8080/",
              ],
              ports: [
                {
                  containerPort: 8443,
                  name: "https",
                },
              ],
              resources: {
                requests: {
                  cpu: k.Quantity.fromString("10m"),
                  memory: k.Quantity.fromString("20Mi"),
                },
                limits: {
                  cpu: k.Quantity.fromString("20m"),
                  memory: k.Quantity.fromString("40Mi"),
                },
              },
            },
          ],
        },
      },
    },
  });

  new k.KubeServiceAccount(c, "prometheus-operator-service-account", {
    metadata: {
      name: "prometheus-operator",
      namespace: opts.namespace,
      labels: {
        app: "prometheus-operator",
      },
    },
  });

  new k.KubeClusterRole(c, `prometheus-operator-role`, {
    metadata: {
      name: "prometheus-operator",
      namespace: opts.namespace,
    },
    rules: [
      {
        apiGroups: ["monitoring.coreos.com"],
        resources: [
          "alertmanagers",
          "alertmanagers/finalizers",
          "alertmanagerconfigs",
          "prometheus",
          "prometheus/finalizers",
          "probes",
          "namespaces",
          "nodes",
          "services",
          "pods",
        ],
        verbs: ["get", "list", "watch"],
      },
      {
        apiGroups: [""],
        resources: ["configmaps"],
        verbs: ["get"],
      },
      {
        apiGroups: ["apps"],
        resources: ["statefulsets"],
        verbs: ["*"],
      },
      {
        apiGroups: [""],
        resources: ["configmaps", "secrets"],
        verbs: ["*"],
      },
      {
        apiGroups: [""],
        resources: ["pods"],
        verbs: ["list", "delete"],
      },
      {
        apiGroups: [""],
        resources: ["services", "services/finalizers", "endpoints"],
        verbs: ["get", "create", "update", "delete"],
      },
      {
        apiGroups: [""],
        resources: ["nodes"],
        verbs: ["list", "watch"],
      },
      {
        apiGroups: [""],
        resources: ["namespaces"],
        verbs: ["list", "get", "watch"],
      },
      {
        apiGroups: ["networking.k8s.io"],
        resources: ["ingresses"],
        verbs: ["list", "list", "watch"],
      },
      {
        apiGroups: ["authentication.k8s.io"],
        resources: ["tokenreviews"],
        verbs: ["create"],
      },
      {
        apiGroups: ["authorization.k8s.io"],
        resources: ["subjectaccessreviews"],
        verbs: ["create"],
      },
      {
        nonResourceUrLs: ["/metrics"],
        verbs: ["get"],
      },
    ],
  });
  new k.KubeClusterRoleBinding(c, "prometheus-operator-role-binding", {
    metadata: {
      name: "prometheus-operator",
    },
    roleRef: {
      apiGroup: "rbac.authorization.k8s.io",
      kind: `ClusterRole`,
      name: "prometheus-operator",
    },
    subjects: [
      {
        kind: `ServiceAccount`,
        name: "prometheus-operator",
        namespace: opts.namespace,
      },
    ],
  });

  const service = new k.KubeService(c, `prometheus-operator-service`, {
    metadata: {
      name: "prometheus-operator-service",
      namespace: opts.namespace,
      labels: {
        app: "prometheus-operator",
      },
      annotations: {},
    },
    spec: {
      type: "NodePort",
      selector: { app: "prometheus-operator" },
      ports: [
        {
          port: 9090,
          name: "http-web",
          protocol: "TCP",
          targetPort: k.IntOrString.fromString("http-web"),
        },
        {
          port: 8443,
          targetPort: k.IntOrString.fromString("https"),
          name: "https",
        },
      ],
    },
  });

  return {
    deployment,
    service,
  };
};

export default operatorDeployment;
