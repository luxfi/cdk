import { Router } from "express";

import InfoRouter from "./info";
import AddressRouter from "./address";
import HealthRouter from "./health";
import KeystoreRouter from "./keystore";

const router = Router();

router.use("/info", InfoRouter);
router.use("/address", AddressRouter);
router.use("/health", HealthRouter);
router.use("/keystore", KeystoreRouter);

export default router;
