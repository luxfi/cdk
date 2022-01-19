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
// import { storage } from "./lib/storage";

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);

    // avaData.addDirectory(path.join(__dirname, "docker/avalanchego/db"));
    // const avaVolume = kplus.Volume.fromConfigMap(avaData, {});
    // const monitorData = new kplus.ConfigMap(this, "monitorData");
    // const monitorVolume = kplus.Volume.fromConfigMap(monitorData);

    // storage(this);

    new k.KubeStorageClass(this, `fast-storage-class`, {
      metadata: {
        name: "fast",
        namespace: "default",
        labels: {
          app: "avanode",
        },
      },
      provisioner: "kubernetes.io/no-provisioner",
      // provisioner: "k8s.io/minikube-hostpath",
      volumeBindingMode: "WaitForFirstConsumer",
      // volumeBindingMode: "Immediate",
    });

    let vol = new k.KubePersistentVolume(this, `ava-data`, {
      metadata: { name: "ava-storage", labels: { app: "avanode" } },
      spec: {
        accessModes: [`ReadWriteOnce`],
        storageClassName: "fast",
        capacity: { storage: k.Quantity.fromString("4Gi") },
        // hostPath: {
        //   path: "/mnt/data",
        // },
        nfs: {
          server: "172.17.0.5",
          path: "/data",
        },
        mountOptions: ["vers=4,loud"],
        // claimRef: {
        //   namespace: "default",
        //   name: "ava-storage-ref",
        // },
        // volumeMode: "Filesystem",
        // persistentVolumeReclaimPolicy: "Retain",
        // nodeAffinity: {
        //   required: {
        //     nodeSelectorTerms: [
        //       {
        //         matchExpressions: [
        //           {
        //             key: "kubernetes.io/hostname",
        //             operator: "In",
        //             values: ["minikube"],
        //           },
        //         ],
        //       },
        //     ],
        //   },
        // },
      },
    });

    new AvaNode(this, `avanode`, {
      image: `docker.io/auser/ava-node:latest`,
      replicas: 1,
      volumes: {
        "/usr/share/.avalanchego": vol,
      },
    });

    new MonitorNode(this, `monitoring-node`, {
      image: `docker.io/auser/mon-node:latest`,
      replicas: 2,
      // volumes: {
      //   "/root": monitorVolume,
      // },
    });
  }
}

const app = new App();
new MyChart(app, "cdk");
app.synth();
