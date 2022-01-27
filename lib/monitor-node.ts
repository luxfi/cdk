import { Construct } from "constructs";
// import { Names } from "cdk8s";
// import * as c from "cdk8s";
import * as kplus from "cdk8s-plus-22";
import { EnvVar } from "../imports/k8s";
import * as m from "./monitoring";

export interface MonitorNodeProps {
  readonly image?: string;
  readonly namespace?: string;
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
    const namespace = props.namespace || "monitoring";

    // ============= Monitoring
    const monOptions: m.MonitoringOptions = {
      namespace,
    };
    m.monitoring(this, monOptions);

    // ============= Grafana
    const grafanaOptions: m.GrafanaOptions = {
      namespace,
      deployment: {
        image,
        replicas,
      },
    };
    m.grafana(this, grafanaOptions);
    // ============= NodeExporter
    const nodeExporterOptions: m.NodeExporterOptions = {
      namespace,
      daemonset: {
        matchLabels: {
          app: "node-exporter",
        },
      },
    };
    m.nodeExporter(this, nodeExporterOptions);
    // ============= Kube State Metrics
    const kubeStateMetricsOptions: m.KubeStateMetricsOptions = {
      namespace: "kube-system",
    };
    m.kubeStateMetrics(this, kubeStateMetricsOptions);
    // ============= Avalanche exporter
    const avalancheExporterOptions: m.AvalancheExporterOptions = {
      namespace,
      daemonset: {
        matchLabels: {
          app: "ava-exporter",
        },
      },
    };
    m.avalancheExporter(this, avalancheExporterOptions);
    // ============= Prometheus
    const prometheusOptions: m.PrometheusOptions = {
      namespace,
      deployment: {
        image,
        replicas,
        useVolumes: false,
      },
    };
    m.prometheus(this, prometheusOptions);
  }
}
