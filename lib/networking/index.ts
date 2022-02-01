import { Construct } from "constructs";
import * as k from "../../imports/k8s";

export interface NetworkingOptions {
  namespace: string;
}

export const networking = (c: Construct, opts: NetworkingOptions) => {

  new k.KubeIngressClass(c, "networking-class", {
    metadata: {
      name: "nginx",
      namespace: opts.namespace,
      labels: {
        "app.kubernetes.io/component": "controller",
      },
      annotations: {
        "ingressclass.kubernetes.io/is-default-class": "true",
      },
    },
    spec: {
      controller: "k8s.io/ingress-nginx",
    },
  });
};
export default networking;
