import express from "express";

import {executeMethodCtrl} from "../../controllers/common";
import {assignMethod} from "../../../helpers/middlewares";
import {issueTXValidation} from "../../validators/avax";
import {
    exportKeyValidation,
    exportValidation,
    importKeyValidation,
    importValidation,
    UTXOValidation
} from "../../validators/common";

const AvaxRouter: express.Router = express.Router();

AvaxRouter.get("/get-atomic-tx/:txID", assignMethod('avax', 'getAtomicTx'), executeMethodCtrl);
AvaxRouter.get("/get-atomic-tx/:txID/:encoding", assignMethod('avax', 'getAtomicTx'), executeMethodCtrl);
AvaxRouter.post("/get-utxos", UTXOValidation, assignMethod('avax', 'getUTXOs'), executeMethodCtrl);
AvaxRouter.post("/import", importValidation, assignMethod('avax', 'import'), executeMethodCtrl);
AvaxRouter.post("/import-key", importKeyValidation, assignMethod('avax', 'importKey'), executeMethodCtrl);
AvaxRouter.post("/issue-tx", issueTXValidation, assignMethod('avax', 'issueTx'), executeMethodCtrl);
AvaxRouter.get("/balance/:address", assignMethod('avax', 'getBalance'), executeMethodCtrl);
AvaxRouter.get("/balance/:address/:assetID", assignMethod('avax', 'getBalance'), executeMethodCtrl);
AvaxRouter.post("/export", exportValidation, assignMethod('avax', 'export'), executeMethodCtrl);
AvaxRouter.post("/export-key", exportKeyValidation, assignMethod('avax', 'exportKey'), executeMethodCtrl);
AvaxRouter.get("/atomic-tx-status/:txID", assignMethod('avax', 'getAtomicTxStatus'), executeMethodCtrl);

export default AvaxRouter;
