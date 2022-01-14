import { Construct } from "constructs";
import * as k from "../../imports/k8s";
import { MonitoringOptions } from "./types";

export const namespace = async (c: Construct, opts: MonitoringOptions) =>
  new k.KubeNamespace(c, `monitoring`, {
    metadata: {
      name: opts.namespace,
    },
    spec: {},
  });

export default namespace;
