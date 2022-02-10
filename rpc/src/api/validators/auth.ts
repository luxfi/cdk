import { body, ValidationChain } from "express-validator";

export const tokenValidation: ValidationChain[] = [
    body("password")
        .not()
        .isEmpty()
        .withMessage("password is required")
        .trim(),
    body("endpoints")
        .not()
        .isEmpty()
        .withMessage("endpoints is required. Use * to generate token for all endpoints")
        .trim()
];

export const revokeValidation: ValidationChain[] = [
    body("password")
        .not()
        .isEmpty()
        .withMessage("password is required")
        .trim(),
    body("token")
        .not()
        .isEmpty()
        .withMessage("token is required.")
        .trim()
];

export const changePasswordValidation: ValidationChain[] = [
    body("oldPassword")
        .not()
        .isEmpty()
        .withMessage("oldPassword is required")
        .trim(),
    body("newPassword")
        .not()
        .isEmpty()
        .withMessage("newPassword is required.")
        .trim()
];
