import {body, ValidationChain} from "express-validator";

export const exportValidation: ValidationChain[] = [
    body("to")
        .not()
        .isEmpty()
        .withMessage("to is required")
        .trim(),
    body("amount")
        .not()
        .isNumeric()
        .withMessage("amount is required")
        .trim(),
    body("username")
        .not()
        .isEmpty()
        .withMessage("username is required")
        .trim(),
    body("password")
        .not()
        .isEmpty()
        .withMessage("password is required")
        .trim()
];

export const importValidation: ValidationChain[] = [
    body("to")
        .not()
        .isEmpty()
        .withMessage("to is required")
        .trim(),
    body("username")
        .not()
        .isEmpty()
        .withMessage("username is required")
        .trim(),
    body("password")
        .not()
        .isEmpty()
        .withMessage("password is required")
        .trim()
];

export const exportKeyValidation: ValidationChain[] = [
    body("address")
        .not()
        .isEmpty()
        .withMessage("address is required")
        .trim(),
    body("username")
        .not()
        .isEmpty()
        .withMessage("username is required")
        .trim(),
    body("password")
        .not()
        .isEmpty()
        .withMessage("password is required")
        .trim()
];
