import { Construct } from "constructs";
import { PrometheusOptions } from "../types";
import * as k from "../../../imports/k8s";

export const volumes = (c: Construct, opts: PrometheusOptions) => {
  const storageVolumeName = "prometheus-data-volume";
  const storageVolumeClaimName = "prometheus-data-volume-claim";

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
        path: "/prometheus",
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
    {
      name: storageVolumeName,
      mountPath: "/prometheus",
      hostPath: {
        path: "/data/prometheus",
        type: "DirectoryOrCreate",
      },
      // persistentVolumeClaim: {
      //   claimName: storageVolumeClaimName,
      // },
    },
  ];

  const storageVolumeClaim = new k.KubePersistentVolumeClaim(
    c,
    storageVolumeClaimName,
    {
      metadata: {
        name: storageVolumeClaimName,
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
    storageVolumeClaimName,
    prometheusVolumeMounts,
  };
};

export default volumes;
