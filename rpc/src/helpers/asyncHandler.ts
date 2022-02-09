import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { BadRequestDataError } from "../core/ApiError";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

export default (execution: AsyncFunction) =>
  (req: Request, res: Response, next: NextFunction): any => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      throw new BadRequestDataError("Validation Failed", errors);

    execution(req, res, next).catch(
      /*(reason) => {
      console.log(reason);
      next();
    }*/ next
    );
  };
