import { Router } from "express";

import InfoRouter from "./info";
import AddressRouter from "./address";
import HealthRouter from "./health";
import KeystoreRouter from "./keystore";
import AuthRouter from "./auth";
import AdminRouter from "./admin";
import WalletRouter from "./wallet";
import AvaxRouter from "./avax";

const router = Router();

router.use("/info", InfoRouter);
router.use("/address", AddressRouter);
router.use("/health", HealthRouter);
router.use("/keystore", KeystoreRouter);
router.use("/auth", AuthRouter);
router.use("/admin", AdminRouter);
router.use("/wallet", WalletRouter);
router.use("/avax", AvaxRouter);

export default router;
