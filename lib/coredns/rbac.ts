import { Construct } from "constructs";
import * as k from "../../../imports/k8s";
import { CoreDNSOptions } from "./types";

export const rbac = async (c: Construct, opts: CoreDNSOptions) => {
  const role = new k.KubeClusterRole(c, `coredns-cluster-role`, {
    metadata: {
      name: "system:coredns",
      namespace: opts.namespace,
      labels: {
        "kubernetes.io/bootstrapping": "rbac-defaults",
      },
    },
    rules: [
      {
        apiGroups: [""],
        resources: ["endpoints", "services", "pods", "namespaces"],
        verbs: ["list", "watch"],
      },
      {
        apiGroups: ["discovery.k8s.io"],
        resources: ["endpointslices"],
        verbs: ["list", "watch"],
      },
    ],
  });

  const roleBinding = new k.KubeClusterRoleBinding(c, "coredns-role-binding", {
    metadata: {
      name: "system:coredns",
      namespace: opts.namespace,
      labels: {
        "kubernetes.io/bootstrapping": "rbac-defaults",
      },
      annotations: {
        "rbac.authorization.kubernetes.io/autoupdate": "true",
      },
    },
    roleRef: {
      apiGroup: "rbac.authorization.k8s.io",
      kind: `ClusterRole`,
      name: "system:coredns",
    },
    subjects: [
      {
        kind: `ServiceAccount`,
        name: "coredns",
        namespace: opts.namespace,
      },
    ],
  });

  return { role, roleBinding };
};

export default rbac;
