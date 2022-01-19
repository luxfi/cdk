import { Construct } from "constructs";
import * as k from "../../../imports/k8s";
import { KubeStateMetricsOptions } from "../types";

export const rbac = async (c: Construct, opts: KubeStateMetricsOptions) => {
  const role = new k.KubeClusterRole(c, `kube-state-metrics-cluster-role`, {
    metadata: {
      name: "kube-state-metrics",
      namespace: opts.namespace,
      labels: {
        "app.kubernetes.io/component": "exporter",
        "app.kubernetes.io/name": "kube-state-metrics",
        "app.kubernetes.io/version": "2.3.0",
      },
    },
    rules: [
      {
        apiGroups: [""],
        resources: [
          "configmaps",
          "secrets",
          "nodes",
          "pods",
          "services",
          "resourcequotas",
          "replicationcontrollers",
          "limitranges",
          "persistentvolumeclaims",
          "persistenvolumes",
          "namespaces",
          "endpoints",
        ],
        verbs: ["list", "watch"],
      },
      {
        apiGroups: ["apps"],
        resources: ["statefulsets", "daemonsets", "deployments", "replicasets"],
        verbs: ["list", "watch"],
      },
      {
        apiGroups: ["batch"],
        resources: ["cronjobs", "jobs"],
        verbs: ["list", "watch"],
      },
      {
        apiGroups: ["autoscaling"],
        resources: ["horizontalpodautoscalers"],
        verbs: ["list", "watch"],
      },
      {
        apiGroups: ["authentication.k8s.io"],
        resources: ["tokenreviews"],
        verbs: ["create"],
      },
      {
        apiGroups: ["authentication.k8s.io"],
        resources: ["subjectaccessreviews"],
        verbs: ["create"],
      },
      {
        apiGroups: ["policy"],
        resources: ["poddisruptionbudgets"],
        verbs: ["list", "watch"],
      },
      {
        apiGroups: ["certificates.k8s.io"],
        resources: ["certificatesigningrequests"],
        verbs: ["list", "watch"],
      },
      {
        apiGroups: ["storage.k8s.io"],
        resources: ["storageclasses", "volumeattachments"],
        verbs: ["list", "watch"],
      },
      {
        apiGroups: ["adminssionregistration.k8s.io"],
        resources: [
          "mutatingwebhookconfigurations",
          "validatingwebhookconfigurations",
        ],
        verbs: ["list", "watch"],
      },
      {
        apiGroups: ["networking.k8s.io"],
        resources: ["networkpolicies", "ingresses"],
        verbs: ["list", "watch"],
      },
      {
        apiGroups: ["coordination.k8s.io"],
        resources: ["leases"],
        verbs: ["list", "watch"],
      },
    ],
  });

  const roleBinding = new k.KubeClusterRoleBinding(
    c,
    "kube-state-metrics-role-binding",
    {
      metadata: {
        name: "kube-state-metrics",
        namespace: opts.namespace,
        labels: {
          "app.kubernetes.io/component": "exporter",
          "app.kubernetes.io/name": "kube-state-metrics",
          "app.kubernetes.io/version": "2.3.0",
        },
      },
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: `ClusterRole`,
        name: "kube-state-metrics",
      },
      subjects: [
        {
          kind: `ServiceAccount`,
          name: "kube-state-metrics",
          namespace: opts.namespace,
        },
      ],
    }
  );

  return { role, roleBinding };
};

export default rbac;
