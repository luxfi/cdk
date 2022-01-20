#!/bin/bash

eval $(minikube docker-env);

npm run init

helm --namespace=kube-system upgrade coredns coredns/coredns \
  --repo https://coredns.github.io/helm \
  --set prometheus.service.enabled=true

helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace

minikube addons enable ingress
