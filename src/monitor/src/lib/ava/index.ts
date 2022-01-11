export * from "./remoteExec";
import { exec } from "./remoteExec";

export const info = {
  getBlockchainID: exec("/ext/info", "info.getBlockchainID"),
  peers: exec("/ext/info", "info.peers"),
  networkName: exec("/ext/info", "info.getNetworkName"),
  isBootstrapped: exec("/ext/info", "info.isBootstrapped", { chain: "X" }),
  uptime: exec("/ext/info", "info.uptime"),
};

export const platform = {
  addDelegator: exec("/ext/P", "platform.addDelegator"),
  addValidator: exec("/ext/P", "platform.addValidator"),
  createAddress: exec("/ext/P", "platform.createAddress"),
  createBlockchain: exec("/ext/P", "platform.createBlockchain"),
  getBlockchains: exec("/ext/P", "platform.getBlockchains"),
  getSubnets: exec("/ext/P", "platform.getSubnets"),
};

export const admin = {
  alias: exec("/ext/admin", "admin.alias"),
};

export const health = {
  health: exec("/ext/health", "health.health"),
};

export const keystore = {
  createUser: exec("/ext/keystore", "keystore.createUser"),
  deleteUser: exec("/ext/keystore", "keystore.deleteUser"),
  exportUser: exec("/ext/keystore", "keystore.exportUser"),
  importUser: exec("/ext/keystore", "keystore.exportUser"),
  listUsers: exec("/ext/keystore", "keystore.listUsers"),
};
