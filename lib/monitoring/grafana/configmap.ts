import { Construct } from "constructs";
import { GrafanaOptions } from "../types";
import * as k from "../../../imports/k8s";
import * as path from "path";
import { directoryMap, grafanaConfigsDirectory } from "../../utils";

export const configMap = (c: Construct, opts: GrafanaOptions) => {
  const data = directoryMap(path.join(grafanaConfigsDirectory, "conf"));

  return new k.KubeConfigMap(c, "grafana-configmap", {
    metadata: {
      name: "grafana-configmap",
      labels: { app: "grafana" },
      namespace: opts.namespace,
    },
    data,
  });
};

export default configMap;
