import asyncHandler from "../../helpers/asyncHandler";
import { Request, Response } from "express";
import InfoService from "../../services/info";
import { SuccessResponse } from "../../core/ApiResponse";

export const getBlockchainIDCtrl = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const data = await InfoService.getBlockchainID(req.params.alias);
    return new SuccessResponse("Blockchain ID", data).send(res);
  }
);