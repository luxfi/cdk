import { Construct } from "constructs";
// import { Names } from "cdk8s";
import {
  // KubeDeployment,
  // Quantity,
  // ContainerPort,
  // ServicePort,
  KubeClusterRole,
  KubeClusterRoleBinding,
  EnvVar,
  // VolumeMount,
  // IntOrString,
} from "../imports/k8s";
import * as kplus from "cdk8s-plus-22";

export interface AvaNodeProps {
  readonly image?: string;
  readonly command?: string;
  readonly args?: string[];
  readonly replicas?: number;
  readonly servicePorts?: kplus.ServicePort[];
  readonly env?: { [key: string]: EnvVar };
  readonly volumes?: { [key: string]: kplus.Volume };
}

// const defaultArgs = ["--config-file=/etc/ava/ava.conf"];

export class AvaNode extends Construct {
  public readonly deployment: kplus.Deployment;
  public readonly container: kplus.Container;

  constructor(scope: Construct, id: string, props: AvaNodeProps) {
    super(scope, id, {});

    const image = props.image || `avaplatform/avalanchego:3163be79`;
    // const command = props.command || `/avalanchego/build/avalanchego`;
    // const args = props.args || defaultArgs;
    // const label = { app: Names.toDnsLabel(this) };
    const replicas = props.replicas ?? 1;
    const env = props.env || {};
    const volumes = props.volumes || {};
    const servicePorts: kplus.ServicePort[] = props.servicePorts || [
      // {
      //   name: `node-port`,
      //   port: 9650,
      // },
      {
        name: `node-ctl`,
        port: 9651,
      },
      {
        name: `node-cli-1`,
        port: 9652,
      },
      {
        name: `node-cli-2`,
        port: 9654,
      },
      {
        name: `node-cli-3`,
        port: 9656,
      },
      {
        name: `node-cli-4`,
        port: 9658,
      },
    ];

    new kplus.ServiceAccount(this, `service-account`, {
      metadata: {
        name: `pod-service-account`,
        namespace: "default",
      },
    });

    new KubeClusterRole(this, `node-role`, {
      metadata: {
        name: "pod-service-account",
      },
      rules: [
        {
          apiGroups: [""],
          resources: ["pods"],
          verbs: ["get", "list"],
        },
        {
          apiGroups: [""],
          resources: ["nodes"],
          verbs: ["get", "list"],
        },
      ],
    });

    new KubeClusterRoleBinding(this, "node-role-binding", {
      metadata: { name: "pod-service-account" },
      subjects: [
        {
          kind: "ServiceAccount",
          name: "default",
          namespace: "default",
        },
      ],
      roleRef: {
        kind: "ClusterRole",
        name: "pod-service-account",
        apiGroup: "rbac.authorization.k8s.io",
      },
    });

    // const labels = { ...label, run: "node" };

    const service = new kplus.Service(this, `node-service`, {
      ports: servicePorts,
      type: kplus.ServiceType.NODE_PORT,
      metadata: {
        labels: {
          run: "ava-node",
        },
      },
      // selector: {
      //   run: "ava-node",
      // },
    });
    this.deployment = new kplus.Deployment(this, `node-deployment`, {
      metadata: {
        labels: {
          run: "ava-node",
        },
      },
      replicas,
      // port: 9650,
    });

    this.container = this.deployment.addContainer({
      image,
      // Uncomment this for local testing purposes
      // In order to test local docker images
      // eval $(minikube docker-env)
      // then build your docker image
      imagePullPolicy: kplus.ImagePullPolicy.NEVER,
      env,
    });

    Object.keys(volumes).forEach((containerPath) => {
      this.deployment.addVolume(volumes[containerPath]);
    });

    service.addDeployment(this.deployment, {
      name: `node-port`,
      port: 9560,
    });

    //   metadata: {
    //     name: id,
    //     labels,
    //   },
    //   spec: {
    //     replicas,
    //     selector: {
    //       matchLabels: label,
    //     },
    //     template: {
    //       metadata: { labels },
    //       spec: {
    //         containers: [
    //           {
    //             name: `ava-node`,
    //             image,
    //             command: [command],
    //             args,
    //             resources: {
    //               limits: {
    //                 memory: Quantity.fromString("512Mi"),
    //                 cpu: Quantity.fromString("500m"),
    //               },
    //             },
    //             env,
    //             ports: containerPorts,
    //             volumeMounts,
    //           },
    //         ],
    //       },
    //     },
    //   },
    // });
  }
}
