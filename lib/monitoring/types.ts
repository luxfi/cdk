export interface BaseOptions {
  namespace: string;
}

export interface DaemonsetOptions {
  matchLabels?: any;
  matchExpressions?: any;
}

export interface MonitoringOptions extends BaseOptions {}

export interface DeploymentOptions {
  replicas: number;
  useVolumes?: boolean;
  image: string;
}

export interface PrometheusOptions extends BaseOptions {
  deployment: DeploymentOptions;
}

export interface GrafanaOptions extends BaseOptions {
  deployment: DeploymentOptions;
}

export interface NodeExporterOptions extends BaseOptions {
  daemonset?: DaemonsetOptions;
}
export interface AvalancheExporterOptions extends BaseOptions {
  daemonset?: DaemonsetOptions;
}
