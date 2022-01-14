import { Construct } from "constructs";
import { PrometheusOptions } from "../types";
import * as k from "../../../imports/k8s";

export const volumes = (c: Construct, opts: PrometheusOptions) => {
  const storageVolumeName = "prometheus-storage-volume";
  const storageVolume = new k.KubePersistentVolume(c, storageVolumeName, {
    metadata: {
      name: storageVolumeName,
      labels: { app: "prometheus-server" },
      namespace: opts.namespace,
    },
    spec: {
      accessModes: [`ReadWriteOnce`],
      storageClassName: "fast",
      capacity: { storage: k.Quantity.fromString("4Gi") },
      local: {
        path: "/data/prometheus",
      },
      volumeMode: "Filesystem",
      persistentVolumeReclaimPolicy: "Delete",
      nodeAffinity: {
        required: {
          nodeSelectorTerms: [
            {
              matchExpressions: [
                {
                  key: "app",
                  operator: "In",
                  values: ["prometheus-server"],
                },
              ],
            },
          ],
        },
      },
    },
  });

  // ============= Volumes
  const prometheusVolumeMounts = [
    { name: storageVolumeName, mountPath: "/prometheus" },
  ];

  const prometheusStorageVolumeClaimName = "prometheus-storage-volume-claim";
  const storageVolumeClaim = new k.KubePersistentVolumeClaim(
    c,
    prometheusStorageVolumeClaimName,
    {
      metadata: {
        name: prometheusStorageVolumeClaimName,
        labels: { app: "prometheus-server" },
        namespace: opts.namespace,
      },
      spec: {
        accessModes: ["ReadWriteOnce"],
        resources: {
          requests: {
            storage: k.Quantity.fromString("1Gi"),
          },
        },
        storageClassName: "fast",
        volumeName: storageVolumeName,
      },
    }
  );

  return {
    storageVolume,
    storageVolumeClaim,
    prometheusVolumeMounts,
  };
};

export default volumes;
