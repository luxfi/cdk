import express from "express";

import {executeMethodCtrl} from "../../controllers/common";
import {assignMethod} from "../../../helpers/middlewares";
import {aliasChainValidation, aliasValidation, setLoggerLevelValidation} from "../../validators/admin";

const AdminRouter: express.Router = express.Router();

AdminRouter.post("/alias", aliasValidation, assignMethod('admin', 'alias'), executeMethodCtrl);
AdminRouter.post("/alias-chain", aliasChainValidation, assignMethod('admin', 'aliasChain'), executeMethodCtrl);
AdminRouter.get("/chain-aliases/:chain", assignMethod('admin', 'getChainAliases'), executeMethodCtrl);
AdminRouter.get("/logger-level/:loggerName", assignMethod('admin', 'getLoggerLevel'), executeMethodCtrl);
AdminRouter.get("/lock-profile", assignMethod('admin', 'lockProfile'), executeMethodCtrl);
AdminRouter.get("/memory-profile", assignMethod('admin', 'memoryProfile'), executeMethodCtrl);
AdminRouter.post("/set-logger-level", setLoggerLevelValidation, assignMethod('admin', 'setLoggerLevel'), executeMethodCtrl);
AdminRouter.post("/start-cpu-profiler", assignMethod('admin', 'startCPUProfiler'), executeMethodCtrl);
AdminRouter.post("/stop-cpu-profiler", assignMethod('admin', 'stopCPUProfiler'), executeMethodCtrl);

export default AdminRouter;
