#!/bin/sh

# set -eo pipefail
# shopt -s nullglob

exec node_exporter --path.procfs=/usr/proc --path.sysfs=/usr/sys \
  --collector.filesystem.ignored-mount-points="^(/rootfs|/host|)/(sys|proc|dev|host|etc)($$|/)" \
  --collector.filesystem.ignored-fs-types="^(sys|proc|auto|cgroup|devpts|ns|au|fuse\.lxc|mqueue)(fs|)$$"
