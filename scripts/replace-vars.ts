#!/usr/bin/env ts-node

// import * as ts from "template-file";
const shell = require("shelljs");
const ts = require("template-file");
const k8File = require("path").join(__dirname, "..", "dist", "cdk.k8s.yaml");

const exec = async (cmd: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const child = shell.exec(cmd, { async: true, silent: true });
    child.stdout.on("data", resolve);
    child.stderr.on("data", reject);
  });
};

const main = async () => {
  // KUBE_IP

  let CLUSTER_DNS_IP: string = "10.96.0.101";
  let STUBDOMAINS: string = "";
  let UPSTREAMNAMESERVER: string = "/etc/resolve.conf";

  try {
    CLUSTER_DNS_IP = await exec(
      `kubectl get service --namespace kube-system kube-dns -o jsonpath="{.spec.clusterIP}"`
    );
  } catch (e) {}
  try {
    STUBDOMAINS = await exec(
      `kubectl -n kube-system get configmap coredns  -ojsonpath='{.data.stubDomains}`
    );
  } catch (e) {}
  try {
    STUBDOMAINS = await exec(
      `kubectl -n kube-system get configmap kube-dns  -ojsonpath='{.data.upstreamNameservers}`
    );
  } catch (e) {}

  const data = {
    CLUSTER_DNS_IP,
    REVERSE_CIDRS: "in-addr.arpa ip6.arpa",
    CLUSTER_DOMAIN: "cluster.local",
    STUBDOMAINS,
    UPSTREAMNAMESERVER,
  };
  const string = await ts.renderFile(k8File, data);
  require("fs").writeFileSync(k8File, string);
};

main();
