import { Construct } from "constructs";
import { CoreDNSOptions } from "./types";
import * as k from "../../imports/k8s";
import * as path from "path";
import { fileMap, corednsConfigsDirectory } from "../utils";

export const configMap = (c: Construct, opts: CoreDNSOptions) => {
  let data = fileMap(path.join(corednsConfigsDirectory, "Corefile"));
  new k.KubeConfigMap(c, "coredns-corefile", {
    metadata: {
      name: "coredns-corefile",
      namespace: opts.namespace,
    },
    data,
  });
};

export default configMap;
