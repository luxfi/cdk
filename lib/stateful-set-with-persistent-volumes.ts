import { ApiObject } from "cdk8s";
import { Construct } from "constructs";

export interface StatefulSetTemplate {
  spec: any;
  metadata: any;
}
export interface StatefulSetVolumeClaimTemplate {
  metadata: any;
  spec: any;
}
export interface StatefulSetProps {
  name?: string;
  selector?: { [key: string]: any };
  replicas: number;
  template: StatefulSetTemplate;
  volumeClaimTemplates: StatefulSetVolumeClaimTemplate[];
  serviceName: string;
}

export const createStatefulSetWithPersistentVolumes = (
  chart: Construct,
  opts: StatefulSetProps
) => {
  const name = opts.name || `${chart}-stateful-set`;
  const serviceName = opts.serviceName || `StatefulSetService`;
  const replicas = opts.replicas ?? 1;
  const selector = opts.selector || { matchLabels: { run: "ava-node" } };
  const template = opts.template;
  const volumeClaimTemplates = opts.volumeClaimTemplates;

  return new ApiObject(chart, name, {
    apiVersion: `apps/v1`,
    kind: `StatefulSet`,
    spec: {
      serviceName,
      selector,
      template,
      replicas,
      volumeClaimTemplates,
    },
  });
};
