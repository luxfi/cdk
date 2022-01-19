import { Construct } from "constructs";
// import { Names } from "cdk8s";
// import * as c from "cdk8s";
// import * as k from "../../imports/k8s";

import { namespace } from "./namespace";
import { server } from "./server";
import { service } from "./service";
import { volume } from "./volume";

export const storage = (c: Construct) => {
  return {
    namespace: namespace(c),
    server: server(c),
    service: service(c),
    volume: volume(c),
  };
};
