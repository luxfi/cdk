import { Construct } from "constructs";
// import { Names } from "cdk8s";
// import * as c from "cdk8s";
import * as kplus from "cdk8s-plus-22";
import { EnvVar } from "../imports/k8s";
import {
  MonitoringOptions,
  PrometheusOptions,
  GrafanaOptions,
  NodeExporterOptions,
  AvalancheExporterOptions,
  monitoring,
  prometheus,
  grafana,
  nodeExporter,
  avalancheExporter,
  KubeStateMetricsOptions,
  kubeStateMetrics,
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

    // ============= Grafana
    const grafanaOptions: GrafanaOptions = {
      namespace: "monitoring",
      deployment: {
        image,
        replicas,
      },
    };
    grafana(this, grafanaOptions);
    // ============= NodeExporter
    const nodeExporterOptions: NodeExporterOptions = {
      namespace: "monitoring",
      daemonset: {
        matchLabels: {
          app: "node-exporter",
        },
      },
    };
    nodeExporter(this, nodeExporterOptions);
    // ============= Kube State Metrics
    const kubeStateMetricsOptions: KubeStateMetricsOptions = {
      namespace: "kube-system",
    };
    kubeStateMetrics(this, kubeStateMetricsOptions);
    // ============= Avalanche exporter
    const avalancheExporterOptions: AvalancheExporterOptions = {
      namespace: "monitoring",
      daemonset: {
        matchLabels: {
          app: "ava-exporter",
        },
      },
    };
    avalancheExporter(this, avalancheExporterOptions);
    // ============= Prometheus
    const prometheusOptions: PrometheusOptions = {
      namespace: "monitoring",
      deployment: {
        image,
        replicas,
        useVolumes: false,
      },
    };
    prometheus(this, prometheusOptions);
  }
}
