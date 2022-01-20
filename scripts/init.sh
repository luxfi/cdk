#!/bin/bash

eval $(minikube docker-env);

npm run init
helm repo add coredns https://coredns.github.io/helm
helm --namespace=kube-system install coredns coredns/coredns \
  --set prometheus.service.enabled=true
