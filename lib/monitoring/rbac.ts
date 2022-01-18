import { Construct } from "constructs";
import * as k from "../../imports/k8s";
import { MonitoringOptions } from "./types";

export const rbac = async (c: Construct, opts: MonitoringOptions) => {
  const role = new k.KubeClusterRole(c, `monitoring-role`, {
    metadata: {
      name: "monitoring-role",
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
  const roleBinding = new k.KubeClusterRoleBinding(
    c,
    "monitoring-role-binding",
    {
      metadata: {
        name: "prometheus",
      },
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: `ClusterRole`,
        name: "monitoring-role",
      },
      subjects: [
        {
          kind: `ServiceAccount`,
          name: "prometheus",
          namespace: opts.namespace,
        },
      ],
    }
  );
  return { role, roleBinding };
};

export default rbac;
