FROM avaplatform/avalanchego:3163be79

RUN apt-get update -yq && \
  apt-get install python3-pip curl -yq && \
  pip3 install kubernetes && \
  mkdir /etc/ava

COPY ./list_nodes.py /tmp
COPY ./avalanche-config.json /etc/ava/ava.json

ENTRYPOINT [ "/avalanchego/build/avalanchego", "--config-file=/etc/ava/ava.json", "--bootstrap-ips=", "\\$(python3 /tmp/list_nodes.py)" ]
