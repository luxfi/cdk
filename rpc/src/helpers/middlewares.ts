import { Request, Response, NextFunction } from "express";

export const assignMethod = function(category: string, method: string){
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.locals) req.locals = {};

        req.locals.category = category;
        req.locals.method = method;
        next();
    }
}