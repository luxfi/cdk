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
          host: "prometheus-service.monitoring.svc.cluster.local",
          http: {
            paths: [
              {
                path: "/*",
                pathType: "Prefix",
                backend: {
                  service: {
                    name: `prometheus-service`,
                    port: { number: 9090 },
                  },
                },
              },
            ],
          },
        },
      ],
      tls: [
        {
          hosts: [`prometheus-service.monitoring.svc.cluster.local`],
          secretName: `prometheus-secret`,
        },
      ],
    },
  });
};
export default ingress;
