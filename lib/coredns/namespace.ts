import { Construct } from "constructs";
import * as k from "../../imports/k8s";
import { CoreDNSOptions } from "./types";

export const namespace = async (c: Construct, opts: CoreDNSOptions) =>
  new k.KubeNamespace(c, `core-dns-namespace`, {
    metadata: {
      name: opts.namespace,
    },
    spec: {},
  });

export default namespace;
