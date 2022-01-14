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

const confDir = path.join(__dirname, "..", "conf");
const prometheusDir = path.join(confDir, "prometheus");
const grafanaDir = path.join(confDir, "grafana");

/// Use the scripts/gen-cert.ts to generate these
const cert = fs.readFileSync(path.join(prometheusDir, "tls.cert"));
const key = fs.readFileSync(path.join(prometheusDir, "tls.key"));

export class MonitorNode extends Construct {
  constructor(scope: Construct, id: string, props: MonitorNodeProps) {
    super(scope, id, {});

    const image = props.image || `docker.io/auser/mon-node:latest`;
    // const image = "prom/prometheus";
    const replicas = props.replicas || 1;

    new k.KubeNamespace(this, `monitoring`, {
      metadata: {
        name: `monitoring`,
      },
      spec: {},
    });

    // ============= Prometheus
    new k.KubeClusterRole(this, `prometheus-role`, {
      metadata: {
        name: `prometheus`,
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

    new k.KubeConfigMap(this, `prometheus-config-map`, {
      metadata: {
        name: "prometheus-config-map",
        labels: { app: "prometheus-server" },
        namespace: "monitoring",
      },

      data: {
        "prometheus.rules": fs
          .readFileSync(path.join(prometheusDir, "prometheus.rules"))
          .toString("utf-8"),
        "prometheus.yml": fs
          .readFileSync(path.join(prometheusDir, "prometheus.yml"))
          .toString("utf-8"),
      },
    });

    const prometheusStorageVolumeName = "prometheus-storage-volume";
    new k.KubePersistentVolume(this, prometheusStorageVolumeName, {
      metadata: {
        name: prometheusStorageVolumeName,
        labels: { app: "prometheus-server" },
        namespace: "monitoring",
      },
      spec: {
        accessModes: [`ReadWriteOnce`],
        storageClassName: "fast",
        capacity: { storage: k.Quantity.fromString("4Gi") },
        local: {
          path: "/prometheus",
        },
        volumeMode: "Filesystem",
        persistentVolumeReclaimPolicy: "Delete",
        nodeAffinity: {
          required: {
            nodeSelectorTerms: [
              {
                matchExpressions: [
                  {
                    key: "app",
                    operator: "In",
                    values: ["prometheus-server"],
                  },
                ],
              },
            ],
          },
        },
      },
    });
    const prometheusConfigVolumeName = "prometheus-config-volume";
    // new k.KubePersistentVolume(this, prometheusConfigVolumeName, {
    //   metadata: {
    //     name: prometheusConfigVolumeName,
    //     labels: { app: "prometheus-server" },
    //   },
    //   spec: {
    //     accessModes: [`ReadWriteOnce`],
    //     storageClassName: "fast",
    //     capacity: { storage: k.Quantity.fromString("4Gi") },
    //     local: {
    //       path: "/etc/prometheus",
    //     },
    //     volumeMode: "Filesystem",
    //     persistentVolumeReclaimPolicy: "Delete",
    //     nodeAffinity: {
    //       required: {
    //         nodeSelectorTerms: [
    //           {
    //             matchExpressions: [
    //               {
    //                 key: "app",
    //                 operator: "In",
    //                 values: ["prometheus-server"],
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //     },
    //   },
    // });

    // ============= Volumes
    const prometheusVolumeMounts = [
      { name: prometheusConfigVolumeName, mountPath: "/etc/prometheus" },
      { name: prometheusStorageVolumeName, mountPath: "/prometheus" },
      // { name: prometheusConfigVolumeName, mountPath: `/etc/prometheus` },
      // { name: prometheusStorageVolumeName, mountPath: `/prometheus/` },
    ];

    // const prometheusConfigVolumeClaimName = "prometheus-conf-volume-claim";
    // new k.KubePersistentVolumeClaim(this, prometheusConfigVolumeClaimName, {
    //   metadata: {
    //     name: prometheusConfigVolumeClaimName,
    //     labels: { app: "prometheus-server" },
    //     namespace: "monitoring",
    //   },
    //   spec: {
    //     accessModes: ["ReadWriteOnce"],
    //     resources: {
    //       requests: {
    //         storage: k.Quantity.fromString("500Mi"),
    //       },
    //     },
    //     storageClassName: "fast",
    //     volumeName: prometheusConfigVolumeName,
    //   },
    // });

    const prometheusStorageVolumeClaimName = "prometheus-storage-volume-claim";
    new k.KubePersistentVolumeClaim(this, prometheusStorageVolumeClaimName, {
      metadata: {
        name: prometheusStorageVolumeClaimName,
        labels: { app: "prometheus-server" },
        namespace: "monitoring",
      },
      spec: {
        accessModes: ["ReadWriteOnce"],
        resources: {
          requests: {
            storage: k.Quantity.fromString("1Gi"),
          },
        },
        storageClassName: "fast",
        volumeName: prometheusStorageVolumeName,
      },
    });

    new k.KubeDeployment(this, `prometheus-deployment`, {
      metadata: {
        namespace: "monitoring",
        name: "prometheus-deployment",
        labels: { app: "prometheus-server" },
      },
      spec: {
        replicas,
        strategy: {
          rollingUpdate: {
            maxSurge: k.IntOrString.fromNumber(1),
            maxUnavailable: k.IntOrString.fromNumber(1),
          },
          type: "RollingUpdate",
        },
        selector: { matchLabels: { app: "prometheus-server" } },
        template: {
          metadata: {
            labels: { app: "prometheus-server" },
            annotations: {
              "prometheus.io/scrape": "true",
              "prometheus.io/port": "9090",
            },
          },
          spec: {
            initContainers: [
              {
                name: "prometheus-data-permissions-setup",
                image: "busybox",
                imagePullPolicy: kplus.ImagePullPolicy.IF_NOT_PRESENT,
                command: ["/bin/chmod", "-R", "777", "/prometheus"],
                volumeMounts: prometheusVolumeMounts,
              },
            ],
            securityContext: {
              // fsGroup: 2000,
              // runAsGroup: 2000,
              // runAsNonRoot: true,
              // runAsUser: 1000,
            },
            terminationGracePeriodSeconds: 300,
            containers: [
              {
                image,
                name: "prometheus-server",
                imagePullPolicy: kplus.ImagePullPolicy.IF_NOT_PRESENT,
                command: ["/usr/bin/prometheus"],
                args: [
                  "--config.file=/etc/prometheus/prometheus.yml",
                  "--storage.tsdb.path=/prometheus/",
                ],
                ports: [{ containerPort: 9090 }],
                volumeMounts: prometheusVolumeMounts,
                resources: {
                  requests: {
                    cpu: k.Quantity.fromString("250m"),
                    memory: k.Quantity.fromString("256Mi"),
                  },
                  limits: {
                    cpu: k.Quantity.fromString("500m"),
                    memory: k.Quantity.fromString("1Gi"),
                  },
                },
              },
            ],
            volumes: [
              {
                name: prometheusConfigVolumeName,
                configMap: {
                  name: "prometheus-config-map",
                },
                // persistentVolumeClaim: { claimName: prometheusConfigVolumeClaimName}
              },
              {
                name: prometheusStorageVolumeName,
                hostPath: {
                  path: "/data/prometheus",
                  // type: "",
                  type: "DirectoryOrCreate",
                },
                // persistentVolumeClaim: {
                //   claimName: prometheusStorageVolumeClaimName,
                // },
              },
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
            port: 9090,
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
                  path: "/",
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
        "tls.crt": cert
          .toString("base64")
          .split("\n")
          .slice(1, cert.length - 2)
          .join(""),
        "tls.key": key
          .toString("base64")
          .split("\n")
          .slice(1, cert.length - 2)
          .join(""),
      },
    });

    // ======= /prometheus

    // ======= grafana
    new k.KubeServiceAccount(this, "grafana", {
      metadata: { name: "grafana", namespace: "monitoring" },
    });

    new k.KubeConfigMap(this, "grafana-server-config-map", {
      metadata: {
        name: "grafana-datasources",
        namespace: "monitoring",
      },
      data: {
        "prometheus.yml": fs
          .readFileSync(path.join(grafanaDir, "datasources", "prometheus.yml"))
          .toString("utf-8"),
      },
    });

    new k.KubeDeployment(this, `grafana-deployment`, {
      metadata: {
        namespace: "monitoring",
        name: "grafana-deployment",
        labels: { app: "grafana-server" },
      },
      spec: {
        replicas,
        strategy: {
          rollingUpdate: {
            maxSurge: k.IntOrString.fromNumber(1),
            maxUnavailable: k.IntOrString.fromNumber(1),
          },
          type: "RollingUpdate",
        },
        selector: { matchLabels: { app: "grafana-server" } },
        template: {
          metadata: {
            labels: { app: "grafana-server" },
            annotations: {
              "prometheus.io/scrape": "true",
              "prometheus.io/port": "9090",
            },
          },
          spec: {
            securityContext: {
              fsGroup: 472,
              runAsUser: 65534,
              // runAsGroup: 2000,
              runAsNonRoot: true,
              // runAsUser: 1000,
            },
            serviceAccountName: "grafana",
            terminationGracePeriodSeconds: 300,
            containers: [
              {
                image,
                name: "grafana-server",
                imagePullPolicy: kplus.ImagePullPolicy.IF_NOT_PRESENT,
                command: ["/usr/sbin/grafana-server"],
                args: [],
                ports: [{ containerPort: 3000 }],
                volumeMounts: [
                  {
                    name: "grafana-storage",
                    subPath: "grafana",
                    mountPath: "/var/lib/grafana",
                    readOnly: false,
                  },
                  {
                    name: "grafana-datasources",
                    mountPath: "/etc/grafana/provisioning/datasources",
                    readOnly: false,
                  },
                ],
                resources: {
                  requests: {
                    cpu: k.Quantity.fromString("500m"),
                    memory: k.Quantity.fromString("500Mi"),
                  },
                  limits: {
                    cpu: k.Quantity.fromString("500m"),
                    memory: k.Quantity.fromString("1Gi"),
                  },
                },
              },
            ],
            volumes: [
              { name: "grafana-storage", emptyDir: {} },
              {
                name: "grafana-datasources",
                configMap: { name: "grafana-datasources", defaultMode: 420 },
              },
            ],
          },
        },
      },
    });

    new k.KubeService(this, `grafana-service`, {
      metadata: {
        name: "grafana-service",
        namespace: "monitoring",
        annotations: {
          "prometheus.io/scrape": "true",
          "prometheus.io/port": "9090",
        },
      },
      spec: {
        selector: { app: "grafana-server" },
        ports: [
          {
            port: 3000,
            targetPort: k.IntOrString.fromNumber(3000),
            protocol: "TCP",
            nodePort: 32000,
          },
        ],
        type: `NodePort`,
      },
    });

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
