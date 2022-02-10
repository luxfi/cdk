import { body, ValidationChain } from "express-validator";

export const addressValidation: ValidationChain[] = [
    body("username")
        .not()
        .isEmpty()
        .withMessage("username is required")
        .trim(),
    body("password")
        .not()
        .isEmpty()
        .withMessage("password is required")
        .trim(),
    body("chain")
        .optional({nullable: true})
        .isIn(['X', 'P', 'C'])
];
