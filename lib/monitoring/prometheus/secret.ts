import { Construct } from "constructs";
import { PrometheusOptions } from "../types";
import * as k from "../../../imports/k8s";
import * as path from "path";
import { directoryMap, promethusConfigsDirectory } from "../../utils";

export const secret = (c: Construct, opts: PrometheusOptions) => {
  const dataFiles = directoryMap(path.join(promethusConfigsDirectory, "cert"));
  const data = Object.keys(dataFiles).reduce((acc: any, key: string) => {
    const value = dataFiles[key].split("\n");
    const val = value.slice(1, value.length - 2).join("");
    return { ...acc, [key]: val };
  }, {});
  return new k.KubeSecret(c, `prometheus-secret`, {
    metadata: {
      name: "prometheus-secret",
      namespace: opts.namespace,
    },
    data,
  });
};

export default secret;
