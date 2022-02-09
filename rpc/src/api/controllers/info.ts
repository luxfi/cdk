import asyncHandler from "../../helpers/asyncHandler";
import { Request, Response } from "express";
import LuxService from "../../services/lux";
import { SuccessResponse } from "../../core/ApiResponse";

export const infoCtrl = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const data = await LuxService.helloWorld();
    return new SuccessResponse("Hello", data).send(res);
  }
);