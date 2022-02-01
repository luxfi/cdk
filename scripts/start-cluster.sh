#!/bin/sh

k3d cluster create lux \
    -p 80:80@loadbalancer \
    -p 443:443@loadbalancer \
    -v $HOME/k3d-registries.yaml:/etc/rancher/k3s/registries.yaml

docker network connect k3d-lux registry.localhost 2>/dev/null
