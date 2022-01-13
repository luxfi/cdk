FROM alpine

ENV DEBIAN_FRONTEND=noninteractive

COPY ./entrypoint.sh /home/auser/entrypoint.sh

RUN adduser --disabled-password auser

RUN mkdir -p /usr/proc /usr/sys
RUN apk update && apk add openrc prometheus prometheus-node-exporter grafana grafana-frontend
RUN rc-update add prometheus default && \
  rc-update add grafana default && \
  chmod +x /home/auser/entrypoint.sh && \
  chown -R auser:auser /home/auser

USER auser

ENTRYPOINT ["/bin/sh", "/home/auser/entrypoint.sh"]

