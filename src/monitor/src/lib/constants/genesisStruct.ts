export const DEFAULT_GENESIS_STRUCT = {
  config: {
    chainID: 13213,
    homesteadBlock: 0,
    eip150Block: 0,
    eip150Hash:
      "0x2086799aeebeae135c246c65021c82b4e15a2c451340993aacfd2751886514f0",
    eip155Block: 0,
    eip158Block: 0,
    byzantiumBlock: 0,
    constantinopleBlock: 0,
    petersburgBlock: 0,
    istanbulBlock: 0,
    muirGlacierBlock: 0,
    subnetEVMTimestamp: 0,
    feeConfig: {
      gasLimit: 8000000,
      targetBlockRate: 2,
      minBaseFee: 13000000000,
      targetGas: 15000000,
      baseFeeChangeDenominator: 36,
      minBlockGasCost: 0,
      maxBlockGasCost: 1000000,
      blockGasCostStep: 200000,
    },
  },
  alloc: {
    "8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC": {
      balance: "333333333333333333333",
    },
  },
  timestamp: "0x0",
  gasLimit: "0x7A1200",
  difficulty: "0x0",
  mixHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
  coinbase: "0x0000000000000000000000000000000000000000",
  number: "0x0",
  gasUsed: "0x0",
  parentHash:
    "0x0000000000000000000000000000000000000000000000000000000000000000",
};

export interface GenesisInput {}

export const createGenesis = ({}: GenesisInput) => {};
