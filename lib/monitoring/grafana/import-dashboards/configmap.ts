import { Construct } from "constructs";
import { GrafanaOptions } from "../../types";
import * as k from "../../../../imports/k8s";
import * as path from "path";
import { fileMap, directoryMap, grafanaConfigsDirectory } from "../../../utils";
const jsonminify = require("jsonminify");

export const configMap = (c: Construct, opts: GrafanaOptions) => {
  const dashboardsDir = path.join(grafanaConfigsDirectory, "dashboards");
  const dashboardFiles = directoryMap(dashboardsDir);
  let data = Object.keys(dashboardFiles).reduce((acc: any, key: any) => {
    const k = key.replace(dashboardsDir, "");
    return { ...acc, [k]: jsonminify(dashboardFiles[k]) };
  }, {});
  new k.KubeConfigMap(c, "grafana-dashboards", {
    metadata: {
      name: "grafana-dashboards",
      namespace: opts.namespace,
    },
    data,
  });

  data = fileMap(path.join(grafanaConfigsDirectory, "avalanche.yaml"));
  new k.KubeConfigMap(c, "grafana-provision-avalanche", {
    metadata: {
      name: "grafana-provision-avalanche",
      namespace: opts.namespace,
    },
    data,
  });

  data = fileMap(path.join(grafanaConfigsDirectory, "prom.yaml"));
  new k.KubeConfigMap(c, "grafana-provision-datasources", {
    metadata: {
      name: "grafana-provision-datasources",
      namespace: opts.namespace,
    },
    data,
  });
};

export default configMap;
