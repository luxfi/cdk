import { Construct } from "constructs";
import { PrometheusOptions } from "../types";
import * as k from "../../../imports/k8s";
import * as path from "path";
import { directoryMap, promethusConfigsDirectory } from "../utils";

export const secret = (c: Construct, opts: PrometheusOptions) => {
  const data = directoryMap(path.join(promethusConfigsDirectory, "cert"));
  return new k.KubeSecret(c, `prometheus-secret`, {
    metadata: {
      name: "prometheus-secret",
      namespace: opts.namespace,
    },
    data,
  });
};

export default secret;
