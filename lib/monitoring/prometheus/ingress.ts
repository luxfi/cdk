import { Construct } from "constructs";
import { PrometheusOptions } from "../types";
import * as k from "../../../imports/k8s";

import { HOST as host } from "../../utils";

export const ingress = (c: Construct, opts: PrometheusOptions) => {
  return new k.KubeIngress(c, `prometheus-ui`, {
    metadata: {
      namespace: opts.namespace,
      name: "prometheus-ui",
      annotations: {
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
      //     hosts: [host],
      //     secretName: `prometheus-secret`,
      //   },
      // ],
    },
  });
};
export default ingress;
