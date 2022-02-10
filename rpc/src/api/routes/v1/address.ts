import express from "express";

import {executeMethodCtrl} from "../../controllers/common";
import {assignMethod} from "../../../helpers/middlewares";
import {addressValidation} from "../../validators/address";
import {createAddressCtrl} from "../../controllers/address";

const AddressRouter: express.Router = express.Router();

AddressRouter.post("/", addressValidation, createAddressCtrl, assignMethod('avm', 'createAddress'), executeMethodCtrl);

export default AddressRouter;
