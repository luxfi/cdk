import { Construct } from "constructs";
import { PrometheusOptions } from "../types";
import * as k from "../../../imports/k8s";
import * as path from "path";
import { directoryMap, promethusConfigsDirectory } from "../utils";

export const rules = (c: Construct, opts: PrometheusOptions) => {
  const promRulesDir = path.join(promethusConfigsDirectory, "rules");
  const ruleFiles = directoryMap(promRulesDir);
  const rules = Object.keys(ruleFiles).reduce((acc: any, key: any) => {
    const k = key.replace(promRulesDir, "");
    return { ...acc, [k]: ruleFiles[k] };
  }, {});
  return new k.KubeConfigMap(c, "prometheus-rules", {
    metadata: {
      name: "prometheus-rules",
      labels: { app: "prometheus" },
      namespace: opts.namespace,
    },
    data: rules,
  });
};

export default rules;
