import express from "express";

import {executeMethodCtrl} from "../../controllers/common";
import {assignMethod} from "../../../helpers/middlewares";

const InfoRouter: express.Router = express.Router();

InfoRouter.get("/blockchain-id/:alias", assignMethod('info', 'getBlockchainID'), executeMethodCtrl);

export default InfoRouter;
