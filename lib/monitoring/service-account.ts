import { Construct } from "constructs";
import * as k from "../../imports/k8s";
import { MonitoringOptions } from "./types";

export const serviceAccount = (c: Construct, options: MonitoringOptions) =>
  new k.KubeServiceAccount(c, "monitoring-service-account", {
    metadata: { name: "monitoring", namespace: options.namespace },
  });

export default serviceAccount;
