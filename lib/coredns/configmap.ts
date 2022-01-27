import { Construct } from "constructs";
import { CoreDNSOptions } from "./types";
import * as k from "../../../imports/k8s";
import * as path from "path";
import { fileMap, corednsConfigsDirectory } from "../../utils";

export const configMap = (c: Construct, opts: CoreDNSOptions) => {
  const data = fileMap(path.join(corednsConfigsDirectory, "Corefile"));
  return new k.KubeConfigMap(c, "coredns-core", {
    metadata: {
      name: "coredns",
      labels: { app: "coredns" },
      namespace: opts.namespace,
    },
    data,
  });
};

export default configMap;