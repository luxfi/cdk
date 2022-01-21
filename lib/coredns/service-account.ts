import { Construct } from "constructs";
import * as k from "../../../imports/k8s";
import { CoreDNSOptions } from "./types";

export const serviceAccount = (c: Construct, opts: CoreDNSOptions) => {
  return new k.KubeServiceAccount(c, `coredns-service-account`, {
    metadata: {
      namespace: opts.namespace,
      name: "coredns",
    },
  });
};

export default serviceAccount;
