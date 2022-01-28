export * from "./remoteExec";
import { exec } from "./remoteExec";

export const info = {
  getBlockchainID: exec("/ext/info", "info.getBlockchainID"),
  peers: exec("/ext/info", "info.peers"),
  getNetworkID: exec("/ext/info", "info.getNetworkID"),
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
  addSubnetValidator: exec("/ext/P", "platform.addSubnetValidator"),
  createAddress: exec("/ext/P", "platform.createAddress"),
  createSubnet: exec("/ext/P", "platform.createSubnet"),
  createBlockchain: exec("/ext/P", "platform.createBlockchain"),
  getBlockchains: exec("/ext/P", "platform.getBlockchains"),
  getBlockchainStatus: exec("/ext/P", "platform.getBlockchainStatus"),
  getCurrentSupply: exec("/ext/P", "platform.getCurrentSupply"),
  getCurrentValidators: exec("/ext/P", "platform.getCurrentValidators"),
  getHeight: exec("/ext/P", "platform.getHeight"),
  getMinStake: exec("/ext/P", "platform.getMinStake"),
  getSubnets: exec("/ext/P", "platform.getSubnets"),
  getStake: exec("/ext/P", "platform.getStake"),
  getPendingValidators: exec("/ext/P", "platform.getPendingValidators"),
  getRewardUTXOs: exec("/ext/P", "platform.getRewardUTXOs"),
  getStakingAssetID: exec("/ext/P", "platform.getStakingAssetID"),
  getTimestamp: exec("/ext/P", "platform.getTimestamp"),
  getTotalStake: exec("/ext/P", "platform.getTotalStake"),
  getTx: exec("/ext/P", "platform.getTx"),
  getTxStatus: exec("/ext/P", "platform.getTxStatus"),
  getUTXOs: exec("/ext/P", "platform.getUTXOs"),
  getValidatorsAt: exec("/ext/P", "platform.getValidatorsAt"),
  importAVAX: exec("/ext/P", "platform.getValidatorsAt"),
  importKey: exec("/ext/P", "platform.importKey"),
  issueTx: exec("/ext/P", "platform.issueTx"),
  listAddresses: exec("/ext/P", "platform.listAddresses"),
  sampleValidators: exec("/ext/P", "platform.sampleValidators"),
  getBalance: exec("/ext/bc/P", "platform.getBalance"),
  validatedBy: exec("/ext/bc/P", "platform.validatedBy"),
  validates: exec("/ext/bc/P", "platform.validates"),
  exportAVAX: exec("/ext/P", "platform.exportAVAX"),
  exportKey: exec("/ext/P", "platform.exportKey"),
};

export const avm = {
  createAddress: exec("/ext/bc", "avm.createAddress"),
  export: exec("/ext/bc/X", "avm.export"),
  getTx: exec("/ext/bc/X", "avm.getTx"),
  getTxStatus: exec("/ext/bc/X", "avm.getTxStatus"),
  getUTXOs: exec("/ext/bc/X", "avm.getUTXOs"),
  import: exec("/ext/bc/X", "avm.import"),
  importKey: exec("/ext/bc", "avm.importKey"),
  issueTx: exec("/ext/bc/X", "avm.issueTx"),
  listAddresses: exec("/ext/bc", "avm.listAddresses"),
  getBalance: exec("/ext/bc", "avm.getBalance"),
  exportKey: exec("/ext/bc/X", "avm.exportKey"),
};

export const avax = {
  getAtomicTx: exec("/ext/bc/C/avax", "avax.getAtomicTx"),
  getUTXOs: exec("/ext/bc/C/avax", "avax.getUTXOs"),
  import: exec("/ext/bc/C/avax", "avax.import"),
  importKey: exec("/ext/bc/C/avax", "avax.importKey"),
  issueTx: exec("/ext/bc/C/avax", "avax.issueTx"),
  getBalance: exec("/ext/bc/C/rpc", "eth_getBalance"),
  export: exec("/ext/bc/C/avax", "avax.export"),
  exportKey: exec("/ext/bc/C/avax", "avax.exportKey"),
  getAtomicTxStatus: exec("/ext/bc/C/avax", "avax.getAtomicTxStatus"),
};

export const wallet = {
  issueTx: exec("/ext/bc/X/wallet", "wallet.issueTx"),
  send: exec("/ext/bc/X/wallet", "wallet.send"),
  sendMultiple: exec("/ext/bc/X/wallet", "wallet.sendMultiple"),
};

export const admin = {
  alias: exec("/ext/admin", "admin.alias"),
  aliasChain: exec("/ext/admin", "admin.aliasChain"),
  getChainAliases: exec("/ext/admin", "admin.getChainAliases"),
  getLoggerLevel: exec("/ext/admin", "admin.getLoggerLevel"),
  lockProfile: exec("/ext/admin", "admin.lockProfile"),
  memoryProfile: exec("/ext/admin", "admin.memoryProfile"),
  setLoggerLevel: exec("/ext/admin", "admin.setLoggerLevel"),
  startCPUProfiler: exec("/ext/admin", "admin.startCPUProfiler"),
  stopCPUProfiler: exec("/ext/admin", "admin.stopCPUProfiler"),
};

export const auth = {
  newToken: exec("/ext/auth", "auth.newToken"),
  revokeToken: exec("/ext/auth", "auth.revokeToken"),
  changePassword: exec("/ext/auth", "auth.changePassword"),
};

export const health = {
  health: exec("/ext/health", "health.health"),
};

export const metrics = exec("/ext/metrics", "metrics");

export const keystore = {
  createUser: exec("/ext/keystore", "keystore.createUser"),
  deleteUser: exec("/ext/keystore", "keystore.deleteUser"),
  exportUser: exec("/ext/keystore", "keystore.exportUser"),
  importUser: exec("/ext/keystore", "keystore.exportUser"),
  listUsers: exec("/ext/keystore", "keystore.listUsers"),
};
