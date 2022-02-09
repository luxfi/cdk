import { Router } from "express";

import InfoRouter from "./info";

const router = Router();

router.use("/info", InfoRouter);

export default router;
