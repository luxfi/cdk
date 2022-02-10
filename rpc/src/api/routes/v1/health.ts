import express from "express";

import {executeMethodCtrl} from "../../controllers/common";
import {assignMethod} from "../../../helpers/middlewares";

const HealthRouter: express.Router = express.Router();

HealthRouter.get("/", assignMethod('health', 'health'), executeMethodCtrl);

export default HealthRouter;
