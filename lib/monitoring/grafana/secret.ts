import { Construct } from "constructs";
import { GrafanaOptions } from "../types";
import * as k from "../../../imports/k8s";

export const secret = (c: Construct, opts: GrafanaOptions) => {
  const data = Object.assign(
    {},
    {
      "admin-username": "YWRtaW4=",
      "admin-password": "YWRtaW4=",
    }
  );
  return new k.KubeSecret(c, `grafana-secret`, {
    metadata: {
      name: "grafana",
      namespace: opts.namespace,
    },
    type: "Opaque",
    data,
  });
};

export default secret;
