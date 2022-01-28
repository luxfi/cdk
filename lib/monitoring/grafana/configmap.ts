import { Construct } from "constructs";
import { GrafanaOptions } from "../types";
import * as k from "../../../imports/k8s";
import * as path from "path";
import { directoryMap, grafanaConfigsDirectory } from "../../utils";

export const configMap = (c: Construct, opts: GrafanaOptions) => {
  const data = directoryMap(path.join(grafanaConfigsDirectory, "conf"));

  new k.KubeConfigMap(c, "grafana-configmap", {
    metadata: {
      name: "grafana-configmap",
      labels: { app: "grafana" },
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
      labels: { app: "grafana" },
      namespace: opts.namespace,
    },
    data: pluginsData,
  });

  // const dashboardsData = directoryMap(
  //   path.join(grafanaConfigsDirectory, "dashboards")
  // );
  // new k.KubeConfigMap(c, "grafana-dashboards", {
  //   metadata: {
  //     name: "grafana-dashboards",
  //     labels: { app: "grafana" },
  //     namespace: opts.namespace,
  //   },
  //   data: dashboardsData,
  // });

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
