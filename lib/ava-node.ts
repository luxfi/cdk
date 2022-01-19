import { Construct } from "constructs";
// import { Names } from "cdk8s";

import * as k from "../imports/k8s";
import {
  // KubeStatefulSet,
  EnvVar,
  // Quantity,
  KubePersistentVolume,
} from "../imports/k8s";
// import * as c from "cdk8s";
import * as kplus from "cdk8s-plus-22";
// import { createServiceAccount } from "./create-service-account";

// import { createStatefulSetWithPersistentVolumes } from "./stateful-set-with-persistent-volumes";

export interface AvaNodeProps {
  readonly image?: string;
  readonly command?: string;
  readonly args?: string[];
  readonly replicas?: number;
  readonly servicePorts?: k.ContainerPort[];
  readonly env?: { [key: string]: EnvVar };
  readonly volumes?: { [key: string]: KubePersistentVolume };
}

// const defaultArgs = ["--config-file=/etc/ava/ava.conf"];

export class AvaNode extends Construct {
  readonly statefulSet: k.KubeStatefulSet;

  constructor(scope: Construct, id: string, props: AvaNodeProps) {
    super(scope, id, {});

    const image = props.image || `avaplatform/avalanchego:3163be79`;
    // const command = props.command || `/avalanchego/build/avalanchego`;
    // const args = props.args || defaultArgs;
    // const label = { app: c.Names.toDnsLabel(this) };
    const replicas = props.replicas || 5;
    // const env = props.env || {};
    const volumes = props.volumes || {};
    const servicePorts: k.ContainerPort[] = props.servicePorts || [
      {
        name: `node-port`,
        containerPort: 9650,
      },
    ];

    // const sa =
    // const serviceAccount = createServiceAccount(this, { name: `ava` });

    // const service = new kplus.Service(this, `ava-service`, {
    //   ports: [{ port: 9650 }],
    //   type: kplus.ServiceType.CLUSTER_IP,
    //   metadata: {
    //     labels: {
    //       app: "avanode-service",
    //     },
    //   },
    // });

    const volumeMounts = Object.keys(volumes).map((key: string) => {
      const volume = volumes[key];
      return {
        name: volume.name,
        mountPath: key,
      };
    });
    const volumeClaimTemplates = Object.keys(volumes).map((key: string) => {
      const volume = volumes[key];
      return {
        metadata: { name: volume.name },
        spec: {
          accessModes: ["ReadWriteOnce"],
          storageClassName: "fast",
          volumeName: "ava-storage",
          resources: {
            requests: {
              storage: k.Quantity.fromString("500M"),
            },
          },
        },
      };
    });

    const config = {
      metadata: {
        name: "avanode-statefulset",
        labels: { app: "avanode" },
      },
      spec: {
        serviceName: "avanode",
        selector: {
          matchLabels: {
            // deploymentId: c.Names.toLabelValue(this),
            app: "avanode",
          },
        },
        updateStrategy: {
          type: "RollingUpdate",
        },
        replicas,
        template: {
          metadata: {
            labels: {
              app: "avanode",
            },
          },
          spec: {
            // serviceAccountName: serviceAccount.name,
            // affinity: {
            //   podAntiAffinity: {
            //     requiredDuringSchedulingIgnoredDuringExecution: [
            //       {
            //         labelSelector: {
            //           matchExpressions: [
            //             { key: "app", operator: "In", values: ["avanode"] },
            //           ],
            //         },
            //         topologyKey: "kubernetes.io/hostname",
            //       },
            //     ],
            //   },
            // },
            containers: [
              {
                name: `avanode`,
                image,
                imagePullPolicy: kplus.ImagePullPolicy.IF_NOT_PRESENT,
                ports: servicePorts,
                resources: {
                  requests: {
                    cpu: k.Quantity.fromString("50m"),
                    memory: k.Quantity.fromString("128Mi"),
                  },
                  limits: {
                    cpu: k.Quantity.fromString("50m"),
                    memory: k.Quantity.fromString("256Mi"),
                  },
                },
                // env: [env],
              },
            ],
          },
        },
      },
    };
    if (volumeClaimTemplates.length > 0) {
      config.spec.volumeClaimTemplates = volumeClaimTemplates;
      for (let i = 0; i < config.spec.template.spec.containers.length; i++) {
        // @ts-ignore
        config.spec.template.spec.containers[i]["volumeMounts"] = volumeMounts;
      }
    }
    this.statefulSet = new k.KubeStatefulSet(
      this,
      `avanode-statefulset`,
      config
    );
  }
}
