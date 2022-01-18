#!/bin/sh

# set -eo pipefail
# shopt -s nullglob

ANOTHER_NODE=$(python3 /tmp/list_nodes.py 2>/dev/null)
CONFIG_FILE=/etc/ava/ava.json
GENESIS_FILE=/etc/ava/genesis.json

FLAGS="--config-file=$CONFIG_FILE --genesis $GENESIS_FILE"

echo "Another node: ${ANOTHER_NODE}"
if [[ ! -z "${ANOTHER_NODE}" ]]; then
  FLAGS="$FLAGS --bootstrap-ips=$ANOTHER_NODE"
fi

CMD="/avalanchego/build/avalanchego $FLAGS"

exec $CMD
