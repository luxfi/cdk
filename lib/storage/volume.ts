import { Construct } from "constructs";
import * as k from "../../imports/k8s";

export const volume = (c: Construct) => {
  return new k.KubePersistentVolume(c, `development-volume`, {
    metadata: {
      name: "development",
      namespace: "development",
    },
    spec: {
      capacity: { storage: k.Quantity.fromString("1Gi") },
      accessModes: ["ReadWriteMany", "ReadWriteOnce"],
      nfs: {
        server: "0.0.0.0",
        path: "/data",
      },
    },
  });
};
export default volume;
