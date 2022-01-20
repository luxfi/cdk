import { Construct } from "constructs";
import * as k from "../../imports/k8s";
import { CoreDNSOptions } from "./types";

export const serviceAccount = (c: Construct, opts: CoreDNSOptions) => {
  const coreDnsServiceAccount = new k.KubeServiceAccount(
    c,
    `core-dns-service-account`,
    {
      metadata: {
        namespace: opts.namespace,
        name: "coredns",
      },
    }
  );

  return { coreDnsServiceAccount };
};

export default serviceAccount;
