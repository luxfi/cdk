require("dotenv").config();
require("dotenv").config({ path: `.env.${process.env.CLUSTER}` });

import { Construct } from "constructs";
import { App, Chart, ChartProps } from "cdk8s";
// import * as kplus from "cdk8s-plus-22";
// import * as path from "path";

import * as k from "./imports/k8s";
// import { WebService } from "./lib/web-service";
import { AvaNode } from "./lib/ava-node";
import { MonitorNode } from "./lib/monitor-node";
// import { coredns } from "./lib/coredns";
// import { storage } from "./lib/storage";

const ON_CLUSTER = process.env.CLUSTER !== "local";

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);

    // avaData.addDirectory(path.join(__dirname, "docker/avalanchego/db"));
    // const avaVolume = kplus.Volume.fromConfigMap(avaData, {});
    // const monitorData = new kplus.ConfigMap(this, "monitorData");
    // const monitorVolume = kplus.Volume.fromConfigMap(monitorData);

    // storage(this);

    const avanode_config = {
      namespace: "ava",
      image: `docker.io/auser/ava-node:latest`,
      replicas: 2,
    };
    const monitor_node_config = {
      image: `docker.io/auser/mon-node:latest`,
      replicas: 1,
    };

    if (ON_CLUSTER) {
      new k.KubeStorageClass(this, `fast-storage-class`, {
        metadata: {
          name: "fast",
          namespace: "default",
          labels: {
            cluster: `${process.env.CLUSTER}`,
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
          // TODO:
          hostPath: {
            path: "/mnt/data",
          },
        },
      });

      // @ts-ignore
      avanode_config["volumes"] = { "usr/share/.avalanchego": vol };
      // @ts-ignore
      monitor_node_config["volumes"] = { "/root": vol };
    }

    // coredns(this, { namespace: "kube-system" });
    new AvaNode(this, `avanode`, avanode_config);
    new MonitorNode(this, `monitoring-node`, monitor_node_config);
  }
}

const app = new App();
new MyChart(app, "cdk");
app.synth();
