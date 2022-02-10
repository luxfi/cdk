import express from "express";

import {executeMethodCtrl} from "../../controllers/common";
import {assignMethod} from "../../../helpers/middlewares";
import {importValidation, userValidation} from "../../validators/keystore";

const KeystoreRouter: express.Router = express.Router();

KeystoreRouter.post("/create-user", userValidation, assignMethod('keystore', 'createUser'), executeMethodCtrl);
KeystoreRouter.delete("/delete-user", userValidation, assignMethod('keystore', 'deleteUser'), executeMethodCtrl);
KeystoreRouter.post("/export-user", userValidation, assignMethod('keystore', 'exportUser'), executeMethodCtrl);
KeystoreRouter.post("/import-user", [...userValidation, ...importValidation],assignMethod('keystore', 'importUser'), executeMethodCtrl);
KeystoreRouter.get("/list-users", assignMethod('keystore', 'listUsers'), executeMethodCtrl);

export default KeystoreRouter;
