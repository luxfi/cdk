import { Construct } from "constructs";
// import { Names } from "cdk8s";

import * as k from "../imports/k8s";
import {
  // KubeStatefulSet,
  EnvVar,
  Quantity,
  KubePersistentVolume,
} from "../imports/k8s";
// import * as k from "cdk8s";
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
  constructor(scope: Construct, id: string, props: AvaNodeProps) {
    super(scope, id, {});

    const image = props.image || `avaplatform/avalanchego:3163be79`;
    // const command = props.command || `/avalanchego/build/avalanchego`;
    // const args = props.args || defaultArgs;
    // const label = { app: Names.toDnsLabel(this) };
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
          run: "ava-node",
          role: "ava-node",
        },
      },
    });

    // ======= Create a stateful set
    // const set = new kplus.KubeStatefulSet(this, `ava-stateful-servier`, {
    //   metadata: {
    //     labels: {
    //       run: "ava-node",
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
          labels: { run: "ava-node", role: "ava-node" },
        },
        spec: {
          accessModes: ["ReadWriteMany"],
          resources: {
            requests: {
              storage: Quantity.fromString("500M"),
            },
          },
          storageClassName: "fast",
          // selector: {
          //   matchLabels: { role: "ava-node" },
          //   matchExpressions: [
          //     { key: "role", operator: "In", values: ["ava-node"] },
          //   ],
          // },
          // volumeMode: "Filesystem",
          volumeName: volume.name,
        },
      });
    });
    const volumeMounts = Object.keys(volumes).map((mountPath: string) => {
      const volume = volumes[mountPath];
      return {
        name: volume.name,
        mountPath,
      };
    });
    const volumesForSet = Object.keys(volumes).map((mountPath: string) => {
      const volume = volumes[mountPath];
      return {
        name: volume.name,
        persistentVolumeClaim: { claimName },
      };
    });
    // const set =
    new k.KubeDeployment(this, `avanodeset`, {
      metadata: { name: "ava-nodeset", labels: { run: "ava-node" } },
      spec: {
        // serviceName: `ava-nodestatefulset`,
        selector: { matchLabels: { run: "ava-node" } },
        replicas,
        template: {
          metadata: { labels: { run: "ava-node" } },
          spec: {
            serviceAccountName: serviceAccount.name,
            containers: [
              {
                name: `ava-node`,
                image,
                imagePullPolicy: kplus.ImagePullPolicy.NEVER,
                volumeMounts,
                resources: {
                  requests: {
                    cpu: k.Quantity.fromString("100m"),
                    memory: k.Quantity.fromString("128Mi"),
                  },
                  limits: {
                    cpu: k.Quantity.fromString("100m"),
                    memory: k.Quantity.fromString("128Mi"),
                  },
                },
                // env: [env],
              },
            ],
            volumes: volumesForSet,
            // affinity: {
            //   podAntiAffinity: {
            //     requiredDuringSchedulingIgnoredDuringExecution: [
            //       {
            //         labelSelector: {
            //           matchExpressions: [
            //             { key: "role", operator: "In", values: ["ava-node"] },
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
