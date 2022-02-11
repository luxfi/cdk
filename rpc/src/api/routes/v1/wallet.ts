import express from "express";

import {executeMethodCtrl} from "../../controllers/common";
import {assignMethod} from "../../../helpers/middlewares";
import {issueValidation, sendValidation} from "../../validators/wallet";

const WalletRouter: express.Router = express.Router();

WalletRouter.post("/issue-tx", issueValidation, assignMethod('wallet', 'issueTx'), executeMethodCtrl);
WalletRouter.post("/send", sendValidation, assignMethod('wallet', 'send'), executeMethodCtrl);

export default WalletRouter;
