import { Construct } from "constructs";
import { DebuggingOptions } from "./types";
import * as k from "../../imports/k8s";

export const dnsutils = (c: Construct, opts: DebuggingOptions) => {
  // const matchExpressions = daemonset.matchExpressions || {};
  return new k.KubePod(c, "dnsutils-debugging", {
    metadata: {
      labels: {
        // "app.kubernetes.io/name": "node-exporter",
        app: "dnsutils",
      },
      name: "dnsutils",
      namespace: opts.namespace,
    },
    spec: {
      restartPolicy: "Always",
      containers: [
        {
          name: "dnsutils",
          image: "k8s.gcr.io/e2e-test-images/jessie-dnsutils:1.3",
          command: ["sleep", "3600"],
          imagePullPolicy: "IfNotPresent",
        },
      ],
    },
  });
};

export default dnsutils;
