import { Construct } from "constructs";
import { GrafanaOptions } from "../../types";
import * as k from "../../../../imports/k8s";
import { IS_LOCAL, HOST, REGISTRY } from "../../../utils";

export const job = (c: Construct, opts: GrafanaOptions) => {
  const host = IS_LOCAL ? `grafana-service.monitoring` : `grafana.${HOST}`;
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
              image: `${REGISTRY}/auser/worker:latest`,
              imagePullPolicy: "IfNotPresent",
              args: [
                "/bin/sh",
                "-c",
                `
            echo "Waiting for grafana to boot-up";
            while [ $(curl -k -Lsw '%{http_code}' "https://${host}:3000" -o /dev/null) -ne "200" ]; do
              echo '.'
              sleep 15;
            done;
            echo "Ready to go";
            `,
              ],
            },
          ],
          containers: [
            {
              name: "grafana-import-dashboards",
              image: `${REGISTRY}/auser/worker:latest`,
              imagePullPolicy: "IfNotPresent",
              command: ["/bin/sh", "-c"],
              workingDir: "/opt/grafana-import-dashboards",
              args: [
                `
            for file in *-datasource.json ; do
              if [ -e "$file" ] ; then
                echo "importing $file" &&
                curl -k \
                  --show-error --silent --fail \
                  --request POST "https://\${GF_ADMIN_USER}:\${GF_ADMIN_PASSWORD}@${host}:3000/api/datasources" \
                  --header "Content-Type: application/json" \
                  --data-binary "@$file"
              fi
            done;

            for file in *-dashboard.json ; do
              if [ -e "$file" ] ; then
                echo "importing $file";
                DATA=$( echo '{"dashboard":'; \
                  cat "$file"; \
                  echo ',"overwrite":true,"inputs":[{"name":"DS_PROMETHEUS","type":"datasource","pluginId":"prometheus", "value":"prometheus"}]}' \
                );
                DATA=$( echo "$DATA" | jq -c '.' );
                curl \
                  -k \
                  --show-error --silent --fail \
                  --request POST https://\${GF_ADMIN_USER}:\${GF_ADMIN_PASSWORD}@${host}:3000/api/dashboards/import \
                  --header "Content-Type: application/json" \
                  --data-binary "$DATA" ;
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
