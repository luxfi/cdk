import { Construct } from "constructs";
import { GrafanaOptions } from "../types";
import * as k from "../../../imports/k8s";
import * as path from "path";
import { fileMap, directoryMap, grafanaConfigsDirectory } from "../../utils";
const jsonminify = require("jsonminify");


export const configMap = (c: Construct, opts: GrafanaOptions) => {
  let data = directoryMap(path.join(grafanaConfigsDirectory, "conf"));

  new k.KubeConfigMap(c, "grafana-configmap", {
    metadata: {
      name: "grafana-configmap",
      labels: { app: "grafana" },
      namespace: opts.namespace,
    },
    data,
  });

  data = fileMap(path.join(grafanaConfigsDirectory, "avalanche.yaml"))
  new k.KubeConfigMap(c, "grafana-avalanche-config", {
    metadata: {
      name: "grafana-avalanche-config",
      namespace: opts.namespace,
    },
    data,
  });

    data = fileMap(path.join(grafanaConfigsDirectory, "prom.yaml"))
  new k.KubeConfigMap(c, "grafana-provision-datasources", {
    metadata: {
      name: "grafana-provision-datasources",
      namespace: opts.namespace,
    },
    data,
  });

  const pluginsData = directoryMap(
    path.join(grafanaConfigsDirectory, "plugins")
  );
  new k.KubeConfigMap(c, "grafana-plugins", {
    metadata: {
      name: "grafana-plugins",
      labels: { app: "grafana", "grafana_dashboard": "1" },
      namespace: opts.namespace,
    },
    data: pluginsData,
  });

  // const dashboardsDir = path.join(grafanaConfigsDirectory, "dashboards");
  // const dashboardFiles = directoryMap(dashboardsDir);
  // let dashboardsData = Object.keys(dashboardFiles).reduce((acc: any, key: any) => {
  //   const k = key.replace(dashboardsDir, "");
  //   return { ...acc, [k]: jsonminify(dashboardFiles[k]) };
  // }, {});
  // new k.KubeConfigMap(c, "grafana-dashboards", {
  //   metadata: {
  //     name: "grafana-dashboards",
  //     labels: { app: "grafana", "grafana_dashboard": "1" },
  //     namespace: opts.namespace,
  //   },
  //   data: dashboardsData,
  // });

  const avaDir = path.join(grafanaConfigsDirectory, "ava");
  const avaFiles = directoryMap(avaDir);
  let avaData = Object.keys(avaFiles).reduce((acc: any, key: any) => {
    const k = key.replace(avaDir, "");
    return { ...acc, [k]: jsonminify(avaFiles[k]) };
  }, {});
  new k.KubeConfigMap(c, "ava-dashboards", {
    metadata: {
      name: "ava-dashboards",
      labels: { app: "grafana" },
      namespace: opts.namespace,
    },
    data: avaData,
  });

  const notifiersData = directoryMap(
    path.join(grafanaConfigsDirectory, "notifiers")
  );
  new k.KubeConfigMap(c, "grafana-notifiers", {
    metadata: {
      name: "grafana-notifiers",
      labels: { app: "grafana" },
      namespace: opts.namespace,
    },
    data: notifiersData,
  });
};

export default configMap;
