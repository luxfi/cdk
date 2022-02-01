import { Construct } from "constructs";
// import { Names } from "cdk8s";
// import * as c from "cdk8s";
// import * as k from "../../imports/k8s";
import { DebuggingOptions } from "./types";

import { dnsutils } from "./dnsutils";
import { k3sDashboard} from './k3s-dashboard'

export const debugging = (c: Construct, opts: DebuggingOptions) => {
  return {
    dnsutils: dnsutils(c, opts),
    k3sDashboard: k3sDashboard(c, opts),
  };
};

export default debugging;
