import { Construct } from "constructs";
import { GrafanaOptions } from "../types";
import * as k from "../../../imports/k8s";

import { HOST } from "../../utils";

export const ingress = (c: Construct, opts: GrafanaOptions) => {
  const host = `grafana.${HOST}`;
  return new k.KubeIngress(c, `grafana-ui`, {
    metadata: {
      namespace: opts.namespace,
      name: "grafana-ui",
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
                    name: `grafana-service`,
                    port: { name: "grafana" },
                  },
                },
              },
            ],
          },
        },
      ],
      tls: [
        {
          hosts: [host, "127.0.0.1", "localhost"],
          secretName: `grafana-tls-secret`,
        },
      ],
    },
  });
};
export default ingress;
