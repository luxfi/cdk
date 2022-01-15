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

  return {
    monitoringServiceAccount,
    prometheusServiceAccount,
  };
};

export default serviceAccount;
