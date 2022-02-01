import { Construct } from "constructs";
import { PrometheusOptions } from "../types";
import * as k from "../../../imports/k8s";

export const service = (c: Construct, opts: PrometheusOptions) => {
  // const changeService = new k.KubeService(c, `prometheus-to-https-service`, {
  //   metadata: {
  //     name: "prometheus-service-to-https",
  //     namespace: opts.namespace,
  //   },
  //   spec: {
  //     selector: { app: "prometheus-server" },
  //     ports: [
  //       {
  //         name: "9090",
  //         port: 80,
  //         protocol: "TCP",
  //         targetPort: k.IntOrString.fromNumber(9090),
  //       },
  //     ],
  //   },
  // });
  const prometheusService = new k.KubeService(c, "prometheus-service", {
    metadata: {
      name: "prometheus-service",
      namespace: opts.namespace,
      labels: { app: "prometheus" },
      annotations: {
        "prometheus.io/scrape": "true",
        "prometheus.io/port": "9090"
      }
    },
    spec: {
      selector: { app: "prometheus" },
      type: "NodePort",
      ports: [
        {
          name: "prometheus",
          protocol: "TCP",
          port: 9090,
        },
      ],
    },
  });

  //   // Outside
  // new k.KubeService(c, "prometheus-lb-service", {
  //   metadata: {
  //     name: "prometheus-lb-service",
  //     namespace: opts.namespace,
  //     labels: { app: "prometheus" },
  //   },
  //   spec: {
  //     selector: { app: "prometheus" },
  //     type: "LoadBalancer",
  //     externalTrafficPolicy: "Cluster",
  //     ports: [
  //       {
  //         name: "prometheus",
  //         port: 8443,
  //         targetPort: k.IntOrString.fromNumber(9090),
  //       },
  //     ],
  //   },
  // });

  return { prometheusService }; // changeService
};

export default service;
