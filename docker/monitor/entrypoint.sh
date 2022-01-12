#!/bin/sh

# set -eo pipefail
# shopt -s nullglob

sudo systemctl start prometheus.service
sudo systemctl start grafana-server.service
sudo systemctl start node_exporter.service
