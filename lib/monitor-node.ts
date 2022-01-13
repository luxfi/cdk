import { Construct } from "constructs";
// import { Names } from "cdk8s";
import * as c from "cdk8s";
import * as k from "../imports/k8s";
import { EnvVar } from "../imports/k8s";
import * as kplus from "cdk8s-plus-22";
// import { createServiceAccount } from "./create-service-account";

export interface MonitorNodeProps {
  readonly image?: string;
  readonly replicas?: number;
  readonly env?: { [key: string]: EnvVar };
  readonly servicePorts?: kplus.ServicePort[];
  readonly volumes?: { [key: string]: kplus.Volume };
}

export class MonitorNode extends Construct {
  constructor(scope: Construct, id: string, props: MonitorNodeProps) {
    super(scope, id, {});

    const image = props.image || `auser/mon-node:latest`;
    // const command = props.command || `/avalanchego/build/avalanchego`;
    // const args = props.args || defaultArgs;
    // const label = { app: Names.toDnsLabel(this) };
    const replicas = props.replicas ?? 1;
    const env = props.env || {};
    // const volumes = props.volumes || {};
    const servicePorts: kplus.ServicePort[] = props.servicePorts || [
      {
        port: 3000,
        name: "web-dashboard",
        protocol: kplus.Protocol.TCP,
        targetPort: 3000,
      },
      {
        port: 9090,
        name: "prometheus-dashboard",
        protocol: kplus.Protocol.TCP,
        targetPort: 9090,
      },
      // {
      //   name: `node-port`,
      //   port: 9650,
      // },
      // {
      //   name: `view-port`,
      //   port: 9090,
      // },
    ];

    // createServiceAccount(this, { name: `monitor` });

    // const service =
    new kplus.Service(this, `monitor-service`, {
      ports: servicePorts,
      type: kplus.ServiceType.CLUSTER_IP,
      metadata: {
        labels: {
          run: "monitor-node",
        },
      },
    });

    const deployment = new kplus.Deployment(this, `node-deployment`, {
      metadata: {
        labels: {
          run: "monitor-node",
        },
      },
      replicas,
      // port: 9090,
    });
    // deployment.selectByLabel("run", "monitor-node");

    // const container =
    deployment.addContainer({
      image,
      // Uncomment this for local testing purposes
      // In order to test local docker images
      // eval $(minikube docker-env)
      // then build your docker image
      imagePullPolicy: kplus.ImagePullPolicy.NEVER,
      env,
    });

    const envs = Object.keys(env).reduce((acc: any[], key: string) => {
      acc.push({ key, name: env[key] });
      return acc;
    }, []);
    const kubeDeployment = c.ApiObject.of(deployment);
    kubeDeployment.addJsonPatch(
      c.JsonPatch.replace("/spec/selector/matchLabels", {
        run: "monitor-node",
      })
    );
    kubeDeployment.addJsonPatch(
      c.JsonPatch.add("/spec/template", {
        metadata: {
          labels: {
            "cdk8s.deployment": deployment.name,
            run: "monitor-node",
          },
        },
        spec: {
          containers: [
            {
              env: envs,
              image,
              imagePullPolicy: kplus.ImagePullPolicy.NEVER,
              name: `main`,
              resources: {
                requests: {
                  cpu: k.Quantity.fromString("50m"),
                  memory: k.Quantity.fromString("512Mi"),
                },
                limits: {
                  cpu: k.Quantity.fromString("50m"),
                  memory: k.Quantity.fromString("512Mi"),
                },
              },
            },
          ],
        },
      })
    );
  }
}
