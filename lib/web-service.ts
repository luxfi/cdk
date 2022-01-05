import { Construct } from "constructs";
import { Names } from "cdk8s";
import { KubeDeployment, KubeService, IntOrString } from "../imports/k8s";

export interface WebServiceProps {
  readonly image: string;
  readonly replicas?: number;
  readonly port?: number;
  readonly containerPort?: number;
}

export class WebService extends Construct {
  constructor(scope: Construct, id: string, props: WebServiceProps) {
    super(scope, id);

    const port = props.port || 80;
    const containerPort = props.containerPort || 8080;
    const label = { app: Names.toDnsLabel(this) };
    const replicas = props.replicas ?? 1;

    new KubeService(this, `web-service`, {
      metadata: { name: id },
      spec: {
        type: `LoadBalancer`,
        ports: [{ port, targetPort: IntOrString.fromNumber(containerPort) }],
        selector: label,
      },
    });

    new KubeDeployment(this, `web-deployment`, {
      metadata: { name: `${id}-deployment` },
      spec: {
        replicas,
        selector: {
          matchLabels: label,
        },
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
              {
                name: `webapp`,
                image: props.image,
                ports: [{ containerPort }],
              },
            ],
          },
        },
      },
    });
  }
}
