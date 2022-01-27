import { Construct } from "constructs";
import { PrometheusOptions } from "../types";
import * as k from "../../../imports/k8s";
import * as path from "path";
import { directoryMap, promethusConfigsDirectory } from "../../utils";

export const secret = (c: Construct, opts: PrometheusOptions) => {
  const dataFiles = directoryMap(path.join(promethusConfigsDirectory, "cert"));
  const data = Object.keys(dataFiles).reduce((acc: any, key: string) => {
    const val = Buffer.from(dataFiles[key]).toString("base64");
    return { ...acc, [key]: val };
  }, {});
  return new k.KubeSecret(c, `prometheus-tls-secret`, {
    metadata: {
      name: "prometheus-tls-secret",
      namespace: opts.namespace,
    },
    type: "kubernetes.io/tls",
    data,
  });
};

export default secret;
