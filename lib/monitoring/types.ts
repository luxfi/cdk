export interface BaseOptions {
  namespace: string;
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
