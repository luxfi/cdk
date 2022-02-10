import express from "express";

import {executeMethodCtrl} from "../../controllers/common";
import {assignMethod} from "../../../helpers/middlewares";

const InfoRouter: express.Router = express.Router();

InfoRouter.get("/blockchain-id/:alias", assignMethod('info', 'getBlockchainID'), executeMethodCtrl);
InfoRouter.get("/network-id/", assignMethod('info', 'getNetworkID'), executeMethodCtrl);
InfoRouter.get("/network-name/", assignMethod('info', 'getNetworkName'), executeMethodCtrl);
InfoRouter.get("/node-id/", assignMethod('info', 'getNodeID'), executeMethodCtrl);
InfoRouter.get("/node-ip/", assignMethod('info', 'getNodeIP'), executeMethodCtrl);
InfoRouter.get("/node-version/", assignMethod('info', 'getNodeVersion'), executeMethodCtrl);
InfoRouter.get("/trx-fees/", assignMethod('info', 'getTxFee'), executeMethodCtrl);
InfoRouter.get("/is-bootstrapped/:chain", assignMethod('info', 'isBootstrapped'), executeMethodCtrl);
InfoRouter.get("/uptime/", assignMethod('info', 'uptime'), executeMethodCtrl);

export default InfoRouter;
