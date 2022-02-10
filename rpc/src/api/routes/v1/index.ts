import { Router } from "express";

import InfoRouter from "./info";
import AddressRouter from "./address";

const router = Router();

router.use("/info", InfoRouter);
router.use("/address", AddressRouter);

export default router;
