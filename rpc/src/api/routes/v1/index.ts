import { Router } from "express";

import HelloRouter from "./info";

const router = Router();

router.use("/hello", HelloRouter);

export default router;
