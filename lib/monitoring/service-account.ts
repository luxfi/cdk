import { Construct } from "constructs";
import * as k from "../../imports/k8s";
import { MonitoringOptions } from "./types";

export const serviceAccount = (c: Construct, options: MonitoringOptions) => {
  const monitoringServiceAccount = new k.KubeServiceAccount(
    c,
    "monitoring-service-account",
    {
      metadata: {
        name: "monitoring",
        labels: { role: "monitoring" },
        namespace: options.namespace,
      },
    }
  );
  const prometheusServiceAccount = new k.KubeServiceAccount(
    c,
    "prometheus-service-account",
    {
      metadata: {
        name: "prometheus",
        labels: { app: "prometheus" },
        namespace: options.namespace,
      },
    }
  );
  const grafanaServiceAccount = new k.KubeServiceAccount(
    c,
    "grafana-service-account",
    {
      metadata: {
        name: "grafana",
        labels: { app: "grafana" },
        namespace: options.namespace,
      },
    }
  );

  return {
    monitoringServiceAccount,
    prometheusServiceAccount,
    grafanaServiceAccount,
  };
};

export default serviceAccount;
