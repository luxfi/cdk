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
        host: `host: ${host}`,
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
                    port: { number: 443 },
                  },
                },
              },
            ],
          },
        },
      ],
      tls: [
        {
          hosts: [host],
          secretName: `grafana-tls-secret`,
        },
      ],
    },
  });
};
export default ingress;
