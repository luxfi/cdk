import { Construct } from "constructs";
import * as k from "../../../imports/k8s";
import { CoreDNSOptions } from "./types";

export const service = (c: Construct, opts: CoreDNSOptions) => {
  return new k.KubeService(c, "coredns-service", {
    metadata: {
      name: "kube-dns",
      namespace: opts.namespace,
      labels: {
        "k8s-app": "kube-dns",
        "kubernetes.io/cluster-service": "true",
        "kubernetes.io/name": "CoreDNS",
      },
      annotations: {
        "prometheus.io/port": "9153",
        "prometheus.io/scrape": "true",
      },
    },
    spec: {
      selector: { "k8s-app": "kube-dns"},
      clusterIP: {{ CLUSTER_DNS_IP }},
      ports: [
        {
          name: "dns",
          port: 53,
          protocol: "UDP"
        },
        {
          name: "dns-tcp",
          port: 53,
          protocol: "TCP"
        },
        {
          name: "metrics",
          port: 9153,
          protocol: "TCP"
        },
      ],
    },
  });
};
export default service;