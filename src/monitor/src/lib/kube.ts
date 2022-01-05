const k8s = require("@kubernetes/client-node");

export const kc = new k8s.KubeConfig();
kc.loadFromDefault();

export const api = kc.makeApiClient(k8s.CoreV1Api);
