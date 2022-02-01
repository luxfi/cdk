import { Construct } from "constructs";
import { DebuggingOptions } from "./types";
import * as k from "../../imports/k8s";

export const k3sDashboard = (c: Construct, _opts: DebuggingOptions) => {
  new k.KubeNamespace(c, 'kubernetes-dashboard-ns', {
    metadata: {
      name: "kubernetes-dashboard"
    }
  })
  new k.KubeServiceAccount(c, `dashboard-admin-user`, {
    metadata: {
      name: "admin-user",
      namespace: "kubernetes-dashboard"
    }
  });

  new k.KubeClusterRoleBinding(c, `admin-user-role-binding`, {
    metadata: {
      name: 'admin-user'
    },
    roleRef: {
      apiGroup: "rbac.authorization.k8s.io",
      kind: "ClusterRole",
      name: "cluster-admin"
    },
    subjects: [
      {
        kind: "ServiceAccount",
        name: "admin-user",
        namespace: "kubernetes-dashboard"
      }
    ]
  })
}

export default k3sDashboard
