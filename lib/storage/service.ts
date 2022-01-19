import { Construct } from "constructs";
import * as k from "../../imports/k8s";

export const service = (c: Construct) => {
  return new k.KubeService(c, "nfs-service", {
    metadata: {
      name: "nfs-server",
      namespace: "development",
      labels: { app: "nfs-server" },
    },
    spec: {
      selector: { app: "nfs-server" },
      ports: [
        {
          port: 2049,
          name: "nfs",
        },
      ],
    },
  });
};

export default service;
