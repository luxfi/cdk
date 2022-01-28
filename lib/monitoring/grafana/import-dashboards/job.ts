import { Construct } from "constructs";
import { GrafanaOptions } from "../../types";
import * as k from "../../../../imports/k8s";
import { HOST } from "../../../utils";

export const job = (c: Construct, opts: GrafanaOptions) => {
  const host = `grafana.${HOST}`;
  return new k.KubeJob(c, "import-dashboards-job", {
    metadata: {
      name: "grafana-import-dashboards",
      namespace: opts.namespace,
      labels: {
        app: "grafana",
      },
    },
    spec: {
      template: {
        metadata: {
          name: "grafana-import-dashboards",
          labels: { app: "grafana" },
        },
        spec: {
          serviceAccountName: "grafana",
          initContainers: [
            {
              name: "wait-for-grafana",
              image: "busybox",
              args: [
                "/bin/sh",
                "-c",
                `
            set -x;
            while [ $(curl -k -Lsw '%{http_code}' "https://${host}:3000" -o /dev/null) -ne 200 ]; do
              echo '.'
              sleep 15;
            done`,
              ],
            },
          ],
          containers: [
            {
              name: "grafana-import-dashboards",
              image: opts.deployment.image,
              imagePullPolicy: "IfNotPresent",
              command: ["/bin/sh", "-c"],
              workingDir: "/opt/grafana-import-dashboards",
              args: [
                `
            for file in *-datasource.json ; do
              if [ -e "$file" ] ; then
                echo "importing $file" &&
                curl --silent --fail --show-error -k \
                  --request POST https://\${GF_ADMIN_USER}:\${GF_ADMIN_PASSWORD}@${host}:3000/api/datasources \
                  --header "Content-Type: application/json" \
                  --data-binary "@$file" ;
                echo "" ;
              fi
            done ;
            for file in *-dashboard.json ; do
              if [ -e "$file" ] ; then
                echo "importing $file" &&
                ( echo '{"dashboard":'; \
                  cat "$file"; \
                  echo ',"overwrite":true,"inputs":[{"name":"DS_PROMETHEUS","type":"datasource","pluginId":"prometheus","value":"prometheus"}]}' ) \
                | jq -c '.' \
                | curl --silent --fail --show-error -k \
                  --request POST https://\${GF_ADMIN_USER}:\${GF_ADMIN_PASSWORD}@${host}:3000/api/dashboards/import \
                  --header "Content-Type: application/json" \
                  --data-binary "@-" ;
                echo "" ;
              fi
            done
            `,
              ],
              env: [
                {
                  name: "GF_ADMIN_USER",
                  valueFrom: {
                    secretKeyRef: {
                      name: "grafana",
                      key: "admin-username",
                    },
                  },
                },
                {
                  name: "GF_ADMIN_PASSWORD",
                  valueFrom: {
                    secretKeyRef: {
                      name: "grafana",
                      key: "admin-password",
                    },
                  },
                },
              ],
              volumeMounts: [
                {
                  name: "config-volume",
                  mountPath: "/opt/grafana-import-dashboards",
                },
              ],
            },
          ],
          restartPolicy: "Never",
          volumes: [
            {
              name: "config-volume",
              configMap: { name: "grafana-dashboards" },
            },
          ],
        },
      },
    },
  });
};

export default job;
