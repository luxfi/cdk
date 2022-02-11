import {body, ValidationChain} from "express-validator";

export const issueValidation: ValidationChain[] = [
    body("tx")
        .not()
        .isEmpty()
        .withMessage("tx is required")
        .trim(),
    body("encoding")
        .optional({nullable: true})
        .not()
        .isIn(["cb58", "hex"])
        .withMessage("encoding should be cb58 & hex")
        .trim()
];

export const sendValidation: ValidationChain[] = [
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
    body("amount")
        .isNumeric()
        .withMessage("amount is required")
        .trim(),
    body("to")
        .not()
        .isEmpty()
        .withMessage("to is required")
        .trim(),
    body("assetID")
        .not()
        .isEmpty()
        .withMessage("assetID is required")
        .trim()
];
