import { Construct } from "constructs";
import { PrometheusOptions } from "../types";
import * as k from "../../../imports/k8s";

export const ingress = (c: Construct, opts: PrometheusOptions) => {
  return new k.KubeIngress(c, `prometheus-ui`, {
    metadata: {
      namespace: opts.namespace,
      name: "prometheus-ui",
      annotations: {
        "kubernetes.io/ingress.class": "nginx",
        "nginx.ingress.kubernetes.io/rewrite-target": "/$1",
      },
    },
    spec: {
      rules: [
        {
          host: "prometheus.lux",
          http: {
            paths: [
              {
                path: "/*",
                pathType: "Prefix",
                backend: {
                  service: {
                    name: `prometheus-service`,
                    port: { number: 8080 },
                  },
                },
              },
            ],
          },
        },
      ],
      // tls: [
      //   {
      //     hosts: [`prometheus.lux`],
      //     secretName: `prometheus-secret`,
      //   },
      // ],
    },
  });
};
export default ingress;
