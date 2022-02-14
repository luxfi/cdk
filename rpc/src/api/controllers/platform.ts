import {NextFunction, Request, Response} from "express";
import {one_month, ten_minutes} from "../../../../src/monitor/src/lib/date";

export const addDelegatorCtrl = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.startTime) req.body.startTime = Math.floor(ten_minutes.getTime() / 1000);
    if (!req.body.endTime) req.body.endTime = Math.floor(one_month.getTime() / 1000);
    if (!req.body.stakeAmount) req.body.stakeAmount = 2000000000000;
    if (!req.body.delegationFeeRate) req.body.delegationFeeRate = 10;

    next();
};
