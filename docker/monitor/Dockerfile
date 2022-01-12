FROM ubuntu

COPY ./prometheus.yml /etc/prometheus/prometheus.yml
COPY ./prometheus.service /usr/lib/systemd/system/prometheus.service
COPY ./node_exporter.service /usr/lib/systemd/system/node_exporter.service
# COPY ./grafana-server.service /usr/lib/systemd/system/grafana-server.service
COPY ./monitoring-installer.sh /tmp/monitoring-installer.sh

RUN apt-get update -yq && apt-get install sudo wget curl gnupg gnupg2 gnupg1 systemctl apt-utils -yq && \
  useradd -M -r -s /bin/bash auser

RUN echo "auser ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/auser && \
  chmod 0440 /etc/sudoers.d/auser

WORKDIR /usr/share
RUN chmod 755 /tmp/monitoring-installer.sh

USER auser

RUN /tmp/monitoring-installer.sh --1
RUN /tmp/monitoring-installer.sh --2
RUN /tmp/monitoring-installer.sh --3
RUN /tmp/monitoring-installer.sh --4
