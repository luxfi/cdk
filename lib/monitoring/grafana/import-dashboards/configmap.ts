import { Construct } from "constructs";
import { GrafanaOptions } from "../../types";
import * as k from "../../../../imports/k8s";
import * as path from "path";
import { directoryMap, grafanaConfigsDirectory } from "../../utils";

export const configMap = (c: Construct, opts: GrafanaOptions) => {
  const dashboardsDir = path.join(grafanaConfigsDirectory, "dashboards");
  const dashboardFiles = directoryMap(dashboardsDir);
  const data = Object.keys(dashboardFiles).reduce((acc: any, key: any) => {
    const k = key.replace(dashboardsDir, "");
    return { ...acc, [k]: dashboardFiles[k] };
  }, {});
  return new k.KubeConfigMap(c, "grafana-import-dashboards", {
    metadata: {
      name: "grafana-import-dashboards",
      namespace: opts.namespace,
    },
    data,
  });
};

export default configMap;
