import { Construct } from "constructs";
import { PrometheusOptions } from "../types";
import * as k from "../../../imports/k8s";

const IS_LOCAL = process.env.CLUSTER === "local";

export const ingress = (c: Construct, opts: PrometheusOptions) => {
  const host = IS_LOCAL ? "prometheus.minikube.local" : process.env.HOST;
  return new k.KubeIngress(c, `prometheus-ui`, {
    metadata: {
      namespace: opts.namespace,
      name: "prometheus-ui",
      annotations: {
        "nginx.ingress.kubernetes.io/rewrite-target": "/$1",
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
                    port: { number: 9090 },
                  },
                },
              },
            ],
          },
        },
      ],
      // tls: [
      //   {
      //     hosts: [`prometheus-service.cluster`],
      //     secretName: `prometheus-secret`,
      //   },
      // ],
    },
  });
};
export default ingress;
