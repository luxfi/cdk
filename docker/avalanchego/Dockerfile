FROM avaplatform/avalanchego:3163be79

RUN apt-get update -yq && \
  apt-get install python3-pip curl -yq && \
  pip3 install kubernetes && \
  mkdir /etc/ava

COPY ./list_nodes.py /tmp
COPY ./avalanche-config.json /etc/ava/ava.json
COPY ./genesis.json /etc/ava/genesis.json
COPY ./chains /etc/ava/chains/

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/bin/bash", "/entrypoint.sh" ]
