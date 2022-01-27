import { Construct } from "constructs";
import { GrafanaOptions } from "../types";
import * as k from "../../../imports/k8s";
import * as path from "path";
import { directoryMap, promethusConfigsDirectory } from "../../utils";

// TODO: For testing?
const grafanaConfigsDirectory = promethusConfigsDirectory;
export const secret = (c: Construct, opts: GrafanaOptions) => {
  const data = Object.assign(
    {},
    {
      "admin-username": "YWRtaW4=",
      "admin-password": "YWRtaW4=",
    }
  );
  const uiSecret = new k.KubeSecret(c, `grafana-secret`, {
    metadata: {
      name: "grafana",
      namespace: opts.namespace,
    },
    type: "Opaque",
    data,
  });

  const dataFiles = directoryMap(path.join(grafanaConfigsDirectory, "cert"));
  const certData = Object.keys(dataFiles).reduce((acc: any, key: string) => {
    const val = Buffer.from(dataFiles[key]).toString("base64");
    return { ...acc, [key]: val };
  }, {});

  const tlsSecret = new k.KubeSecret(c, `grafana-tls-secret`, {
    metadata: {
      name: "grafana-tls-secret",
      namespace: opts.namespace,
    },
    type: "kubernetes.io/tls",
    data: certData,
  });

  return { tlsSecret, uiSecret };
};

export default secret;
