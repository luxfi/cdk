#!/bin/bash

# eval $(minikube docker-env);

cat << EOF > $HOME/k3d-registries.yaml
mirrors:
    "registry.localhost:5000":
       endpoint:
         -  "http://registry.localhost:5000"
EOF

cat << EOF > /etc/docker/daemon.json
{
    "debug": true,
    "experimental": false,
    "insecure-registries": [
        "registry.localhost:5000"
    ],
    "registry-mirrors": [
        "https://registry-1.docker.io"
    ]
}
EOF

cat << EOF > /etc/hosts
# Added for Kubernetes development
127.0.0.1 registry.localhost
::1       registry.localhost
#End of section
EOF

npm run init
