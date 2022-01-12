import { Construct } from "constructs";
import * as kplus from "cdk8s-plus-22";
import { KubeClusterRole, KubeClusterRoleBinding } from "../imports/k8s";

export interface ServiceAccountOpts {
  name?: string;
}
export const createServiceAccount = (
  chart: Construct,
  opts: ServiceAccountOpts = {}
) => {
  const name = opts.name || "account";
  const sa = new kplus.ServiceAccount(chart, `${name}-service-account`, {
    metadata: {
      name: `${name}-pod-service-account`,
      namespace: "default",
    },
  });

  new KubeClusterRole(chart, `${name}-node-role`, {
    metadata: {
      name: `${name}-pod-service-account`,
    },
    rules: [
      {
        apiGroups: [""],
        resources: ["pods"],
        verbs: ["get", "list"],
      },
      {
        apiGroups: [""],
        resources: ["nodes"],
        verbs: ["get", "list"],
      },
      {
        apiGroups: [""],
        resources: ["storage"],
        verbs: ["get", "list", "create", "destroy"],
      },
    ],
  });

  new KubeClusterRoleBinding(chart, "node-role-binding", {
    metadata: { name: `${name}-pod-service-account` },
    subjects: [
      {
        kind: "ServiceAccount",
        name: "default",
        namespace: "default",
      },
    ],
    roleRef: {
      kind: "ClusterRole",
      name: "monitor-pod-service-account",
      apiGroup: "rbac.authorization.k8s.io",
    },
  });

  return sa;
};
