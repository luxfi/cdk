import { Construct } from "constructs";
// import { Names } from "cdk8s";
// import * as c from "cdk8s";
// import * as k from "../../imports/k8s";
import { DebuggingOptions } from "./types";

import { dnsutils } from "./dnsutils";

export const debugging = (c: Construct, opts: DebuggingOptions) => {
  return {
    dnsutils: dnsutils(c, opts),
  };
};

export default debugging;
