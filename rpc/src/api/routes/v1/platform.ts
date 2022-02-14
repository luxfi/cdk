import express from "express";

import {executeMethodCtrl} from "../../controllers/common";
import {assignMethod} from "../../../helpers/middlewares";
import {
    addDelegatorValidation,
    addSubnetValidatorValidation,
    createSubnetValidation,
    getCurrentValidatorsValidation
} from "../../validators/platform";
import {addDelegatorCtrl} from "../../controllers/platform";
import {
    createAddressValidation,
    exportValidation,
    importKeyValidation,
    importValidation,
    UTXOValidation
} from "../../validators/common";
import {issueTXValidation} from "../../validators/avax";

const PlatformRouter: express.Router = express.Router();

PlatformRouter.post("/add-delegator", addDelegatorValidation, addDelegatorCtrl, assignMethod('platform', 'addDelegator'), executeMethodCtrl);
PlatformRouter.post("/add-validator", addDelegatorValidation, addDelegatorCtrl, assignMethod('platform', 'addValidator'), executeMethodCtrl);
PlatformRouter.post("/add-subnet-validator", [...addDelegatorValidation, ...addSubnetValidatorValidation], addDelegatorCtrl, assignMethod('platform', 'addSubnetValidator'), executeMethodCtrl);
PlatformRouter.post("/create-address", createAddressValidation, assignMethod('platform', 'createAddress'), executeMethodCtrl);
PlatformRouter.post("/create-subnet", createSubnetValidation, assignMethod('platform', 'createSubnet'), executeMethodCtrl);
PlatformRouter.get("/blockchains/:type", assignMethod('platform', 'getBlockchains'), executeMethodCtrl);
PlatformRouter.get("/blockchain-status/:blockchainID", assignMethod('platform', 'getBlockchainStatus'), executeMethodCtrl);
PlatformRouter.get("/current-supply", assignMethod('platform', 'getCurrentSupply'), executeMethodCtrl);
PlatformRouter.post("/current-validators", getCurrentValidatorsValidation, assignMethod('platform', 'getCurrentValidators'), executeMethodCtrl);
PlatformRouter.get("/height", assignMethod('platform', 'getHeight'), executeMethodCtrl);
PlatformRouter.get("/min-stake", assignMethod('platform', 'getMinStake'), executeMethodCtrl);
PlatformRouter.get("/subnets/:type", assignMethod('platform', 'getSubnets'), executeMethodCtrl);
PlatformRouter.get("/stake/:address", assignMethod('platform', 'getStake'), executeMethodCtrl);
PlatformRouter.get("/reward-utxos/:txID", assignMethod('platform', 'getRewardUTXOs'), executeMethodCtrl);
PlatformRouter.get("/reward-utxos/:txID/:encoding", assignMethod('platform', 'getRewardUTXOs'), executeMethodCtrl);
PlatformRouter.get("/staking-asset-id/:subnetID", assignMethod('platform', 'getStakingAssetID'), executeMethodCtrl);
PlatformRouter.get("/timestamp", assignMethod('platform', 'getTimestamp'), executeMethodCtrl);
PlatformRouter.get("/total-stakes", assignMethod('platform', 'getTotalStake'), executeMethodCtrl);
PlatformRouter.get("/get-tx/:address", assignMethod('platform', 'getTx'), executeMethodCtrl);
PlatformRouter.get("/get-tx/:address/:encoding", assignMethod('platform', 'getTx'), executeMethodCtrl);
PlatformRouter.get("/tx-status/:txID", assignMethod('platform', 'getTxStatus'), executeMethodCtrl);
PlatformRouter.post("/get-utxos", UTXOValidation, assignMethod('platform', 'getUTXOs'), executeMethodCtrl);
PlatformRouter.get("/get-validator-at/:height", assignMethod('platform', 'getValidatorsAt'), executeMethodCtrl);
PlatformRouter.get("/get-validator-at/:height/:subnetID", assignMethod('platform', 'getValidatorsAt'), executeMethodCtrl);
PlatformRouter.post("/import", importValidation, assignMethod('platform', 'importAVAX'), executeMethodCtrl);
PlatformRouter.post("/import-key", importKeyValidation, assignMethod('platform', 'importKey'), executeMethodCtrl);
PlatformRouter.post("/issue-tx", issueTXValidation, assignMethod('platform', 'issueTx'), executeMethodCtrl);
PlatformRouter.get("/list-addresses/:username/:password", assignMethod('platform', 'listAddresses'), executeMethodCtrl);
PlatformRouter.get("/balance/:address", assignMethod('platform', 'getBalance'), executeMethodCtrl);
PlatformRouter.get("/balance/:address/:assetID", assignMethod('platform', 'getBalance'), executeMethodCtrl);
PlatformRouter.post("/export", exportValidation, assignMethod('platform', 'export'), executeMethodCtrl);

export default PlatformRouter;
