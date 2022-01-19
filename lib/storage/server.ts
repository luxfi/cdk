import { Construct } from "constructs";
import * as k from "../../imports/k8s";

export const server = (c: Construct) => {
  return new k.KubeDeployment(c, "nfs-server", {
    metadata: {
      name: "nfs-server",
      namespace: "development",
      labels: { app: "nfs-server" },
    },
    spec: {
      replicas: 1,
      selector: { matchLabels: { app: "nfs-server" } },
      template: {
        metadata: { name: "nfs-server", labels: { app: "nfs-server" } },
        spec: {
          containers: [
            {
              name: "nfs-server",
              image: "itsthenetwork/nfs-server-alpine:12",
              env: [
                {
                  name: "SHARED_DIRECTORY",
                  value: "/root",
                },
              ],
              ports: [
                {
                  name: "nfs",
                  containerPort: 2049,
                },
              ],
              securityContext: { privileged: true },
            },
          ],
        },
      },
    },
  });
};

export default server;
