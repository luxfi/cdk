export interface BaseOptions {
  namespace: string;
}

export interface MonitoringOptions extends BaseOptions {}

export interface PrometheusOptions extends BaseOptions {
  deployment: {
    replicas: number;
    useVolumes: boolean;
    image: string;
  };
}
