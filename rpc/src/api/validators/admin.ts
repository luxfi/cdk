import {body, ValidationChain} from "express-validator";

export const aliasValidation: ValidationChain[] = [
    body("endpoint")
        .not()
        .isEmpty()
        .withMessage("endpoint is required")
        .trim(),
    body("alias")
        .not()
        .isEmpty()
        .withMessage("alias is required. Use * to generate token for all endpoints")
        .trim()
];

export const aliasChainValidation: ValidationChain[] = [
    body("chain")
        .not()
        .isEmpty()
        .withMessage("chain is required")
        .trim(),
    body("alias")
        .not()
        .isEmpty()
        .withMessage("alias is required. Use * to generate token for all endpoints")
        .trim()
];

export const setLoggerLevelValidation: ValidationChain[] = [
    body("loggerName")
        .not()
        .isEmpty()
        .withMessage("loggerName is required")
        .trim()
];
