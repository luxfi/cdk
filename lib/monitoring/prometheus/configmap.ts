import { Construct } from "constructs";
import { PrometheusOptions } from "../types";
import * as k from "../../../imports/k8s";
import * as path from "path";
import { fileMap, promethusConfigsDirectory } from "../../utils";

export const configMap = (c: Construct, opts: PrometheusOptions) => {
  const data = fileMap(path.join(promethusConfigsDirectory, "prometheus.yaml"));
  return new k.KubeConfigMap(c, "prometheus-core", {
    metadata: {
      name: "prometheus-core",
      labels: { app: "prometheus" },
      namespace: opts.namespace,
    },
    data,
  });
};

export default configMap;
