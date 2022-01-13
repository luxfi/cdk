require("dotenv").config();
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

import { Construct } from "constructs";
import { App, Chart, ChartProps } from "cdk8s";
// import * as kplus from "cdk8s-plus-22";
// import * as path from "path";

import * as k from "./imports/k8s";
// import { WebService } from "./lib/web-service";
import { AvaNode } from "./lib/ava-node";
import { MonitorNode } from "./lib/monitor-node";

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);

    // avaData.addDirectory(path.join(__dirname, "docker/avalanchego/db"));
    // const avaVolume = kplus.Volume.fromConfigMap(avaData, {});
    // const monitorData = new kplus.ConfigMap(this, "monitorData");
    // const monitorVolume = kplus.Volume.fromConfigMap(monitorData);

    new k.KubeStorageClass(this, `fast-storage-class`, {
      metadata: { name: "fast" },
      provisioner: "kubernetes.io/no-provisioner",
      volumeBindingMode: "WaitForFirstConsumer",
    });

    let vol = new k.KubePersistentVolume(this, `ava-data`, {
      metadata: { name: "ava-data" },
      spec: {
        accessModes: [`ReadWriteMany`],
        storageClassName: "fast",
        capacity: { storage: k.Quantity.fromString("4Gi") },
        hostPath: {
          path: "/data/vol1",
        },
        volumeMode: "Filesystem",
        persistentVolumeReclaimPolicy: "Delete",
        nodeAffinity: {
          required: {
            nodeSelectorTerms: [
              {
                matchExpressions: [
                  {
                    key: "run",
                    operator: "In",
                    values: ["ava-node"],
                  },
                ],
              },
            ],
          },
        },
      },
    });

    new AvaNode(this, `ava-node`, {
      image: `docker.io/auser/ava-node:latest`,
      replicas: 3,
      volumes: {
        "/root": vol,
      },
    });

    new MonitorNode(this, `monitoring-node`, {
      image: `docker.io/auser/mon-node:latest`,
      replicas: 1,
      // volumes: {
      //   "/root": monitorVolume,
      // },
    });
  }
}

const app = new App();
new MyChart(app, "cdk");
app.synth();
