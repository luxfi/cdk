import { Construct } from "constructs";
import service from "./service";
import configmap from "./configmap";
// import namespace from "./namespace";
import rbac from "./rbac";
import serviceAccount from "./service-account";
import deployment from "./deployment";
import { CoreDNSOptions } from "./types";

export const coredns = (c: Construct, opts: CoreDNSOptions) => {
  return {
    // namespace: namespace(c, opts),
    serviceAccount: serviceAccount(c, opts),
    rbac: rbac(c, opts),
    configmap: configmap(c, opts),
    deployment: deployment(c, opts),
    service: service(c, opts),
  };
};

export default coredns;
