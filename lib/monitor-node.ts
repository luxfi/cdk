import { Construct } from "constructs";
// import { Names } from "cdk8s";
// import * as c from "cdk8s";
import * as k from "../imports/k8s";
import { EnvVar } from "../imports/k8s";
import * as kplus from "cdk8s-plus-22";
import * as fs from "fs";
import * as path from "path";
// import { createServiceAccount } from "./create-service-account";

export interface MonitorNodeProps {
  readonly image?: string;
  readonly replicas?: number;
  readonly env?: { [key: string]: EnvVar };
  readonly servicePorts?: kplus.ServicePort[];
  readonly volumes?: { [key: string]: kplus.Volume };
}

/// Use the scripts/gen-cert.ts to generate these
const cert = fs.readFileSync(
  path.join(__dirname, "..", "conf", "prometheus", "tls.cert")
);
const key = fs.readFileSync(
  path.join(__dirname, "..", "conf", "prometheus", "tls.key")
);

export class MonitorNode extends Construct {
  constructor(scope: Construct, id: string, props: MonitorNodeProps) {
    super(scope, id, {});

    const image = props.image || `auser/mon-node:latest`;
    // const command = props.command || `/avalanchego/build/avalanchego`;
    // const args = props.args || defaultArgs;
    // const label = { app: Names.toDnsLabel(this) };
    const replicas = props.replicas ?? 1;
    // const env = props.env || {};

    // ============= Prometheus
    new k.KubeClusterRole(this, `prometheus-role`, {
      metadata: {
        name: `prometheus-role`,
      },
      rules: [
        {
          apiGroups: [""],
          resources: ["nodes", "nodes/proxy", "services", "endpoints", "pods"],
          verbs: ["get", "list", "watch"],
        },
        {
          apiGroups: ["extensions"],
          resources: ["ingresses"],
          verbs: ["get", "list", "watch"],
        },
        {
          nonResourceUrLs: ["/metrics"],
          verbs: ["get"],
        },
      ],
    });
    new k.KubeClusterRoleBinding(this, `prometheus`, {
      metadata: {
        name: `prometheus`,
      },
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: `ClusterRole`,
        name: `prometheus`,
      },
      subjects: [
        { kind: `ServiceAccount`, name: "default", namespace: "monitoring" },
      ],
    });

    const prometheusConfigMap = new kplus.ConfigMap(
      this,
      `prometheus-config-map`
    );
    prometheusConfigMap.addDirectory(
      path.join(__dirname, "..", "conf", "prometheus")
    );
    const prometheusConfigVolume =
      kplus.Volume.fromConfigMap(prometheusConfigMap);
    const prometheusStorageVolume = kplus.Volume.fromEmptyDir(
      `prometheus-storage-volume`
    );
    const prometheusVolumeMounts = [
      { name: prometheusConfigVolume.name, mountPath: `/etc/prometheus` },
      { name: prometheusStorageVolume.name, mountPath: `/prometheus/` },
    ];

    new k.KubeDeployment(this, `prometheus-deployment`, {
      metadata: {
        namespace: "monitoring",
        name: "prometheus-deployment",
        labels: { app: "prometheus-server" },
      },
      spec: {
        replicas,
        selector: { matchLabels: { app: "prometheus-server" } },
        template: {
          metadata: { labels: { app: "prometheus-server" } },
          spec: {
            containers: [
              {
                image,
                name: "prometheus",
                imagePullPolicy: kplus.ImagePullPolicy.NEVER,
                args: [
                  "--config.file=/etc/prometheus/prometheus.yml",
                  "--storage.tsdb.path=/prometheus/",
                ],
                ports: [{ containerPort: 9090 }],
                volumeMounts: prometheusVolumeMounts,
              },
            ],
            volumes: [
              {
                name: prometheusConfigVolume.name,
                configMap: { defaultMode: 420, name: `prometheus-server-conf` },
              },
              { name: prometheusStorageVolume.name },
            ],
          },
        },
      },
    });

    new k.KubeService(this, `prometheus-service`, {
      metadata: {
        name: "prometheus-service",
        namespace: "monitoring",
        annotations: {
          "prometheus.io/scrape": "true",
          "prometheus.io/port": "9090",
        },
      },
      spec: {
        selector: { app: "prometheus-server" },
        ports: [
          {
            port: 8080,
            targetPort: k.IntOrString.fromNumber(9090),
            nodePort: 30000,
          },
        ],
        type: `NodePort`,
      },
    });

    new k.KubeIngress(this, `prometheus-ui`, {
      metadata: {
        namespace: "monitoring",
        name: "prometheus-ui",
        annotations: {
          "kubernetes.io/ingress.class": "nginx",
        },
      },
      spec: {
        rules: [
          {
            host: `prometheus.lux`,
            http: {
              paths: [
                {
                  path: "/dashboard",
                  pathType: "Prefix",
                  backend: {
                    service: {
                      name: `prometheus-service`,
                      port: { number: 8080 },
                    },
                  },
                },
              ],
            },
          },
        ],
        tls: [
          {
            hosts: [`prometheus.lux`],
            secretName: `prometheus-secret`,
          },
        ],
      },
    });

    new k.KubeSecret(this, `prometheus-secret`, {
      metadata: {
        name: "prometheus-secret",
        namespace: "monitoring",
      },
      data: {
        "tls.crt": Buffer.from(cert).toString("base64"),
        "tls.key": Buffer.from(key).toString("base64"),
      },
    });

    /// =============== /Prometheus

    // const volumes = props.volumes || {};
    // const servicePorts: kplus.ServicePort[] = props.servicePorts || [
    //   {
    //     port: 3000,
    //     name: "web-dashboard",
    //     protocol: kplus.Protocol.TCP,
    //     targetPort: 3000,
    //   },
    //   {
    //     port: 9090,
    //     name: "prometheus-dashboard",
    //     protocol: kplus.Protocol.TCP,
    //     targetPort: 9090,
    //   },
    // {
    //   name: `node-port`,
    //   port: 9650,
    // },
    // {
    //   name: `view-port`,
    //   port: 9090,
    // },
    // ];

    // createServiceAccount(this, { name: `monitor` });

    // const service =
    // new kplus.Service(this, `monitor-service`, {
    //   ports: servicePorts,
    //   type: kplus.ServiceType.CLUSTER_IP,
    //   metadata: {
    //     labels: {
    //       run: "monitor-node",
    //     },
    //   },
    // });

    // const deployment = new kplus.Deployment(this, `node-deployment`, {
    //   metadata: {
    //     labels: {
    //       run: "monitor-node",
    //     },
    //   },
    //   replicas,
    //   // port: 9090,
    // });
    // // deployment.selectByLabel("run", "monitor-node");

    // // const container =
    // deployment.addContainer({
    //   image,
    //   // Uncomment this for local testing purposes
    //   // In order to test local docker images
    //   // eval $(minikube docker-env)
    //   // then build your docker image
    //   imagePullPolicy: kplus.ImagePullPolicy.NEVER,
    //   env,
    // });

    // const envs = Object.keys(env).reduce((acc: any[], key: string) => {
    //   acc.push({ key, name: env[key] });
    //   return acc;
    // }, []);
    // const kubeDeployment = c.ApiObject.of(deployment);
    // kubeDeployment.addJsonPatch(
    //   c.JsonPatch.replace("/spec/selector/matchLabels", {
    //     run: "monitor-node",
    //   })
    // );
    // kubeDeployment.addJsonPatch(
    //   c.JsonPatch.add("/spec/template", {
    //     metadata: {
    //       labels: {
    //         "cdk8s.deployment": deployment.name,
    //         run: "monitor-node",
    //       },
    //     },
    //     spec: {
    //       containers: [
    //         {
    //           env: envs,
    //           image,
    //           imagePullPolicy: kplus.ImagePullPolicy.NEVER,
    //           name: `main`,
    //           resources: {
    //             requests: {
    //               cpu: k.Quantity.fromString("50m"),
    //               memory: k.Quantity.fromString("512Mi"),
    //             },
    //             limits: {
    //               cpu: k.Quantity.fromString("50m"),
    //               memory: k.Quantity.fromString("512Mi"),
    //             },
    //           },
    //         },
    //       ],
    //     },
    //   })
    // );
  }
}
