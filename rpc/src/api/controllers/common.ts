import asyncHandler from "../../helpers/asyncHandler";
import {Request, Response} from "express";
import CommonService from "../../services/common";
import {SuccessResponse} from "../../core/ApiResponse";

export const executeMethodCtrl = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
        const category = req.locals.category;
        const method = req.locals.method;
        const args = {...req.params, ...req.body};
        const data = await CommonService.executeMethod(category, method, args);
        return new SuccessResponse("Method executed successfully!", data).send(res);
    }
);