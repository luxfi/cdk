import express from "express";

import {getBlockchainIDCtrl} from "../../controllers/info";

const InfoRouter: express.Router = express.Router();

InfoRouter.get("/blockchain-id/:alias", getBlockchainIDCtrl);

export default InfoRouter;
