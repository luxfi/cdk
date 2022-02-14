import express from "express";

import {executeMethodCtrl} from "../../controllers/common";
import {assignMethod} from "../../../helpers/middlewares";
import {issueTXValidation} from "../../validators/avax";
import {
    createAddressValidation, exportKeyValidation,
    exportValidation,
    importKeyValidation,
    importValidation,
    UTXOValidation
} from "../../validators/common";
import {sendNFTValidation, sendValidation} from "../../validators/avm";

const AvmRouter: express.Router = express.Router();

AvmRouter.post("/get-utxos", UTXOValidation, assignMethod('avm', 'getUTXOs'), executeMethodCtrl);
AvmRouter.post("/import", importValidation, assignMethod('avm', 'import'), executeMethodCtrl);
AvmRouter.post("/import-key", importKeyValidation, assignMethod('avm', 'importKey'), executeMethodCtrl);
AvmRouter.post("/issue-tx", issueTXValidation, assignMethod('avm', 'issueTx'), executeMethodCtrl);
AvmRouter.get("/balance/:address", assignMethod('avm', 'getBalance'), executeMethodCtrl);
AvmRouter.get("/balance/:address/:assetID", assignMethod('avm', 'getBalance'), executeMethodCtrl);
AvmRouter.get("/all-balances/:address", assignMethod('avm', 'getAllBalances'), executeMethodCtrl);
AvmRouter.get("/asset-description/:assetID", assignMethod('avm', 'getAssetDescription'), executeMethodCtrl);
AvmRouter.get("/all-transactions/:address/:assetID", assignMethod('avm', 'getAddressTxs'), executeMethodCtrl);
AvmRouter.get("/get-tx/:address", assignMethod('avm', 'getTx'), executeMethodCtrl);
AvmRouter.get("/get-tx/:address/:encoding", assignMethod('avm', 'getTx'), executeMethodCtrl);
AvmRouter.get("/tx-status/:txID", assignMethod('avm', 'getTxStatus'), executeMethodCtrl);
AvmRouter.post("/export", exportValidation, assignMethod('avm', 'export'), executeMethodCtrl);
AvmRouter.post("/export-key", exportKeyValidation, assignMethod('avm', 'exportAVAX'), executeMethodCtrl);
AvmRouter.get("/list-addresses/:username/:password", assignMethod('avm', 'listAddresses'), executeMethodCtrl);
AvmRouter.post("/create-address", createAddressValidation, assignMethod('avm', 'createAddress'), executeMethodCtrl);
AvmRouter.post("/send", sendValidation, assignMethod('avm', 'send'), executeMethodCtrl);
AvmRouter.post("/send-nft", sendNFTValidation, assignMethod('avm', 'sendNFT'), executeMethodCtrl);

export default AvmRouter;
