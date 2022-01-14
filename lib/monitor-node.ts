import { Construct } from "constructs";
// import { Names } from "cdk8s";
// import * as c from "cdk8s";
import * as kplus from "cdk8s-plus-22";
import { EnvVar } from "../imports/k8s";
import {
  MonitoringOptions,
  PrometheusOptions,
  monitoring,
  prometheus,
} from "./monitoring";

export interface MonitorNodeProps {
  readonly image?: string;
  readonly replicas?: number;
  readonly env?: { [key: string]: EnvVar };
  readonly servicePorts?: kplus.ServicePort[];
  readonly volumes?: { [key: string]: kplus.Volume };
}

export class MonitorNode extends Construct {
  constructor(scope: Construct, id: string, props: MonitorNodeProps) {
    super(scope, id, {});

    const image = props.image || `docker.io/auser/mon-node:latest`;
    // const image = "prom/prometheus";
    const replicas = props.replicas || 1;

    // ============= Monitoring
    const monOptions: MonitoringOptions = {
      namespace: "monitoring",
    };
    monitoring(this, monOptions);
    // ============= Prometheus
    const prometheusOptions: PrometheusOptions = {
      namespace: "monitoring",
      deployment: {
        image,
        replicas,
        useVolumes: true,
      },
    };
    prometheus(this, prometheusOptions);
  }
}
