import { Construct } from "constructs";
// import { Names } from "cdk8s";
// import * as c from "cdk8s";
// import * as k from "../../imports/k8s";
import { CoreDNSOptions } from "./types";
import rbac from "./rbac";
import serviceAccount from "./service-account";
import service from "./service";
import types from "./types";
import configmap from "./configmap";
import deployment from "./deployment";

export const coredns = (c: Construct, opts: CoreDNSOptions) => {
  return {
    serviceAccount: serviceAccount(c, opts),
    rbac: rbac(c, opts),
    configmap: configmap(c, opts),
    deployment: deployment(c, opts),
    service: service(c, opts),
  };
};

export default coredns;
