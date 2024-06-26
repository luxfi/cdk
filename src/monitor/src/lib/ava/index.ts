export * from "./remoteExec";
import { exec } from "./remoteExec";

export const info = {
  getBlockchainID: exec("/ext/info", "info.getBlockchainID"),
  peers: exec("/ext/info", "info.peers"),
  getNetworkName: exec("/ext/info", "info.getNetworkName"),
  isBootstrapped: exec("/ext/info", "info.isBootstrapped", { chain: "X" }),
  uptime: exec("/ext/info", "info.uptime"),
  getNodeID: exec("/ext/info", "info.getNodeID"),
  getNodeIP: exec("/ext/info", "info.getNodeIP"),
  getNodeVersion: exec("/ext/info", "info.getNodeVersion"),
  getTxFee: exec("/ext/info", "info.getTxFee"),
};

export const platform = {
  addDelegator: exec("/ext/P", "platform.addDelegator"),
  addValidator: exec("/ext/P", "platform.addValidator"),
  createAddress: exec("/ext/P", "platform.createAddress"),
  createSubnet: exec("/ext/P", "platform.createSubnet"),
  createBlockchain: exec("/ext/P", "platform.createBlockchain"),
  getBlockchains: exec("/ext/P", "platform.getBlockchains"),
  getSubnets: exec("/ext/P", "platform.getSubnets"),
  getPendingValidators: exec("/ext/P", "platform.getPendingValidators"),
  importKey: exec("/ext/P", "platform.importKey"),
  getBalance: exec("/ext/bc/P", "platform.getBalance"),
};

export const avm = {
  createAddress: exec("/ext/bc", "avm.createAddress"),
  importKey: exec("/ext/bc", "avm.importKey"),
  getBalance: exec("/ext/bc", "avm.getBalance"),
};

export const avax = {
  importKey: exec("/ext/bc/C/avax", "avax.importKey"),
  getBalance: exec("/ext/bc/C/rpc", "eth_getBalance"),
};

export const admin = {
  alias: exec("/ext/admin", "admin.alias"),
};

export const auth = {
  newToken: exec("/ext/auth", "auth.newToken"),
  revokeToken: exec("/ext/auth", "auth.revokeToken"),
  changePassword: exec("/ext/auth", "auth.changePassword"),
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
