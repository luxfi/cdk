import { body, ValidationChain } from "express-validator";

export const userValidation: ValidationChain[] = [
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
    body("user")
        .not()
        .isEmpty()
        .withMessage("user is required")
        .trim()
];
