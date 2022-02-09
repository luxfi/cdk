import express from "express";

import {infoCtrl} from "../../controllers/info";

const InfoRouter: express.Router = express.Router();

InfoRouter.get("/", infoCtrl);

export default InfoRouter;
