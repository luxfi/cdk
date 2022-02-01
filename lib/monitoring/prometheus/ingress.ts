import { Construct } from "constructs";
import { PrometheusOptions } from "../types";
import * as k from "../../../imports/k8s";

import { HOST } from "../../utils";

export const ingress = (c: Construct, opts: PrometheusOptions) => {
  const host = `prometheus.${HOST}`;
  return new k.KubeIngress(c, `prometheus-ui`, {
    metadata: {
      namespace: opts.namespace,
      name: "prometheus-ui",
      labels: {
        app: "prometheus"
      },
      annotations: {
        // "kubernetes.io/ingress.class": "nginx",
        // "nginx.ingress.kubernetes.io/rewrite-target": "/$1",
      },
    },
    spec: {
      ingressClassName: "nginx",
      rules: [
        {
          host,
          http: {
            paths: [
              {
                path: "/",
                pathType: "Prefix",
                backend: {
                  service: {
                    name: `prometheus-service`,
                    port: { name: "prometheus" },
                  },
                },
              },
            ],
          },
        },
      ],
      // tls: [
      //   {
      //     hosts: [host, "prometheus-service.monitoring"],
      //     secretName: `prometheus-secret`,
      //   },
      // ],
    },
  });
};
export default ingress;
