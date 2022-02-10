import {NextFunction, Request, Response} from "express";

export const createAddressCtrl = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.chain || req.body.chain === "") req.body.chain = "X";

    const chain = req.body.chain;
    req.body = Object.assign({}, req.body, {
        path: (originalPath: string) => `${originalPath}/${chain}`,
    });
    delete req.body.chain;

    next();
};