import { Construct } from "constructs";
import { GrafanaOptions } from "../types";
import * as k from "../../../imports/k8s";

export const ingress = (c: Construct, opts: GrafanaOptions) => {
  return new k.KubeIngress(c, `grafana-ui`, {
    metadata: {
      namespace: opts.namespace,
      name: "grafana-ui",
      annotations: {
        "kubernetes.io/ingress.class": "nginx",
        "nginx.ingress.kubernetes.io/rewrite-target": "/$1",
      },
    },
    spec: {
      rules: [
        {
          host: `grafana.cluster.local`,
          http: {
            paths: [
              {
                path: "/dashboard",
                pathType: "Prefix",
                backend: {
                  service: {
                    name: `grafana-service`,
                    port: { number: 3000 },
                  },
                },
              },
            ],
          },
        },
      ],
      tls: [
        {
          hosts: [`grafana.lux`],
          secretName: `grafana-secret`,
        },
      ],
    },
  });
};
export default ingress;
