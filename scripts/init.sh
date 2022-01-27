#!/bin/bash

eval $(minikube docker-env);

npm run init

helm --namespace=kube-system upgrade coredns coredns/coredns \
  --repo https://coredns.github.io/helm \
  --set prometheus.service.enabled=true \
  --set grafana.service.enabled=true

helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace

# helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
# helm repo update
# helm install prometheus prometheus-community/kube-prometheus-stack

# kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml

minikube addons enable ingress
