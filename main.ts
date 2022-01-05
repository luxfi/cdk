require("dotenv").config();
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

import { Construct } from "constructs";
import { App, Chart, ChartProps } from "cdk8s";
import * as kplus from "cdk8s-plus-22";

import // KubeService,
// IntOrString,
// Quantity,
// KubePersistentVolume,
// KubePersistentVolumeClaim,
"./imports/k8s";
// import { WebService } from "./lib/web-service";
import { AvaNode } from "./lib/ava-node";

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);

    const dataVolume = kplus.Volume.fromEmptyDir(`node-data-volume`);

    new AvaNode(this, `ava-node`, {
      image: `docker.io/auser/ava-node:latest`,
      replicas: 3,
      volumes: {
        "/usr/share/.avalanchego": dataVolume,
      },
    });
}

const app = new App();
new MyChart(app, "cdk");
app.synth();
