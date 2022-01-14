import { Construct } from "constructs";
import * as k from "../../imports/k8s";
import { MonitoringOptions } from "./types";

export const rbac = async (c: Construct, opts: MonitoringOptions) => {
  const role = new k.KubeClusterRole(c, `prometheus-role`, {
    metadata: {
      name: "prometheus",
      namespace: opts.namespace,
    },
    rules: [
      {
        apiGroups: [""],
        resources: ["nodes", "nodes/proxy", "services", "endpoints", "pods"],
        verbs: ["get", "list", "watch"],
      },
      {
        apiGroups: [""],
        resources: ["configmaps"],
        verbs: ["get"],
      },
      {
        apiGroups: ["extensions"],
        resources: ["ingresses"],
        verbs: ["get", "list", "watch"],
      },
      {
        nonResourceUrLs: ["/metrics"],
        verbs: ["get"],
      },
    ],
  });
  const roleBinding = new k.KubeClusterRoleBinding(c, "prometheus", {
    metadata: {
      name: "prometheus",
    },
    roleRef: {
      apiGroup: "rbac.authorization.k8s.io",
      kind: `ClusterRole`,
      name: "prometheus",
    },
    subjects: [
      { kind: `ServiceAccount`, name: "monitoring", namespace: opts.namespace },
    ],
  });
  return { role, roleBinding };
};

export default rbac;
