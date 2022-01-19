import { Construct } from "constructs";
import * as k from "../../imports/k8s";

export const namespace = async (c: Construct) =>
  new k.KubeNamespace(c, `storage-development`, {
    metadata: {
      name: "development",
    },
    spec: {},
  });

export default namespace;
