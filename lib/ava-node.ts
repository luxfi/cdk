import { Construct } from "constructs";
// import { Names } from "cdk8s";

import * as k from "../imports/k8s";
import {
  // KubeStatefulSet,
  EnvVar,
  Quantity,
  KubePersistentVolume,
} from "../imports/k8s";
import * as c from "cdk8s";
import * as kplus from "cdk8s-plus-22";
import { createServiceAccount } from "./create-service-account";

// import { createStatefulSetWithPersistentVolumes } from "./stateful-set-with-persistent-volumes";

export interface AvaNodeProps {
  readonly image?: string;
  readonly command?: string;
  readonly args?: string[];
  readonly replicas?: number;
  readonly servicePorts?: kplus.ServicePort[];
  readonly env?: { [key: string]: EnvVar };
  readonly volumes?: { [key: string]: KubePersistentVolume };
}

// const defaultArgs = ["--config-file=/etc/ava/ava.conf"];

export class AvaNode extends Construct {
  readonly deployment: k.KubeDeployment;

  constructor(scope: Construct, id: string, props: AvaNodeProps) {
    super(scope, id, {});

    const image = props.image || `avaplatform/avalanchego:3163be79`;
    // const command = props.command || `/avalanchego/build/avalanchego`;
    // const args = props.args || defaultArgs;
    // const label = { app: c.Names.toDnsLabel(this) };
    const replicas = props.replicas || 5;
    // const env = props.env || {};
    const volumes = props.volumes || {};
    const servicePorts: kplus.ServicePort[] = props.servicePorts || [
      {
        name: `node-port`,
        port: 9650,
      },
    ];

    // const sa =
    const serviceAccount = createServiceAccount(this, { name: `ava` });

    // const service =
    new kplus.Service(this, `ava-service`, {
      ports: servicePorts,
      type: kplus.ServiceType.CLUSTER_IP,
      metadata: {
        labels: {
          app: "avanode-service",
        },
      },
    });

    // ======= Create a stateful set
    // const set = new kplus.KubeStatefulSet(this, `ava-stateful-servier`, {
    //   metadata: {
    //     labels: {
    //       app: "ava-node",
    //     },
    //   },
    //   serviceAccount,
    //   service,
    //   replicas,
    // });
    const claimName = `ava-nodeclaim`;
    // const volumeClaims =
    Object.keys(volumes).map((mountPath: string) => {
      const volume = volumes[mountPath];
      return new k.KubePersistentVolumeClaim(this, claimName, {
        metadata: {
          name: claimName,
          labels: { app: "avanode-storage" },
        },
        spec: {
          accessModes: ["ReadWriteOnce"],
          resources: {
            requests: {
              storage: Quantity.fromString("500M"),
            },
          },
          storageClassName: "fast",
          // selector: {
          //   matchLabels: { role: "avanode" },
          //   matchExpressions: [
          //     { key: "role", operator: "In", values: ["avanode"] },
          //   ],
          // },
          // volumeMode: "Filesystem",
          volumeName: volume.name,
        },
      });
    });
    // const volumeMounts = Object.keys(volumes).map((mountPath: string) => {
    //   const volume = volumes[mountPath];
    //   return {
    //     name: volume.name,
    //     mountPath,
    //   };
    // });
    // const volumesForSet = Object.keys(volumes).map((mountPath: string) => {
    //   const volume = volumes[mountPath];
    //   return {
    //     name: volume.name,
    //     persistentVolumeClaim: { claimName },
    //   };
    // });
    // // const set =
    this.deployment = new k.KubeDeployment(this, `avanode`, {
      metadata: { name: "avanode", labels: { app: "avanode" } },
      spec: {
        // serviceName: `ava-nodestatefulset`,
        selector: {
          matchLabels: {
            deploymentId: c.Names.toLabelValue(this),
            app: "avanode",
          },
        },
        replicas,
        template: {
          metadata: {
            labels: {
              deploymentId: c.Names.toLabelValue(this),
              app: "avanode",
            },
          },
          spec: {
            serviceAccountName: serviceAccount.name,
            containers: [
              {
                name: `avanode`,
                image,
                imagePullPolicy: kplus.ImagePullPolicy.IF_NOT_PRESENT,
                // volumeMounts,
                resources: {
                  requests: {
                    cpu: k.Quantity.fromString("100m"),
                    memory: k.Quantity.fromString("128Mi"),
                  },
                  limits: {
                    cpu: k.Quantity.fromString("100m"),
                    memory: k.Quantity.fromString("256Mi"),
                  },
                },
                // env: [env],
              },
            ],
            // volumes: volumesForSet,
            // affinity: {
            //   podAntiAffinity: {
            //     requiredDuringSchedulingIgnoredDuringExecution: [
            //       {
            //         labelSelector: {
            //           matchExpressions: [
            //             { key: "role", operator: "In", values: ["avanode"] },
            //           ],
            //         },
            //         topologyKey: "kubernetes.io/hostname",
            //       },
            //     ],
            //   },
            // },
          },
        },
      },
    });
  }
}
