import { Construct } from "constructs";
import { GrafanaOptions } from "../types";
import * as k from "../../../imports/k8s";

const IS_LOCAL = process.env.CLUSTER === "local";

export const ingress = (c: Construct, opts: GrafanaOptions) => {
  const host = IS_LOCAL ? "grafana.minikube.local" : process.env.HOST;
  return new k.KubeIngress(c, `grafana-ui`, {
    metadata: {
      namespace: opts.namespace,
      name: "grafana-ui",
      annotations: {
        // "kubernetes.io/ingress.class": "nginx",
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
                path: "/v1/grafana",
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
      // tls: [
      //   {
      //     hosts: [`grafana.cluster`],
      //     secretName: `grafana-tls-secret`,
      //   },
      // ],
    },
  });
};
export default ingress;
