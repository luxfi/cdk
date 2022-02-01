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
      // namespace: "default",
      annotations: {
        // "prometheus.io/scrape": "true",
        // "prometheus.io/path": "/metrics",
        // "prometheus.io/port": "9090",
      },
      labels: { app: "prometheus", service: "prometheus-service" },
    },
    spec: {
      sessionAffinity: "ClientIP",
      clusterIp: "None",
      selector: { service: "prometheus-service" },
      type: "ClusterIP",
      ports: [
        {
          name: "prometheus-ui",
          port: 9090,
          targetPort: k.IntOrString.fromString("prometheus-ui"),
        },
      ],
    },
  });
  return { prometheusService }; // changeService
};

export default service;
