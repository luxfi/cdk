import express from "express";

import {executeMethodCtrl} from "../../controllers/common";
import {assignMethod} from "../../../helpers/middlewares";
import {changePasswordValidation, revokeValidation, tokenValidation} from "../../validators/auth";

const AuthRouter: express.Router = express.Router();

AuthRouter.post("/create-token", tokenValidation, assignMethod('auth', 'newToken'), executeMethodCtrl);
AuthRouter.post("/revoke-token", revokeValidation, assignMethod('auth', 'revokeToken'), executeMethodCtrl);
AuthRouter.post("/change-password", changePasswordValidation, assignMethod('auth', 'changePassword'), executeMethodCtrl);

export default AuthRouter;
