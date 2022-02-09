import express from "express";

import {helloCtrl} from "../../controllers/hello";

const AccountRouter: express.Router = express.Router();

AccountRouter.get("/", helloCtrl);

export default AccountRouter;
