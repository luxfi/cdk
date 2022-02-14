import {body, ValidationChain} from "express-validator";

export const UTXOValidation: ValidationChain[] = [
    body("addresses")
        .isArray()
        .not()
        .isEmpty()
        .withMessage("addresses is required")
        .trim(),
    body("encoding")
        .optional({nullable: true})
        .not()
        .isIn(["cb58", "hex"])
        .withMessage("encoding should be cb58 & hex")
        .trim()
];

export const importKeyValidation: ValidationChain[] = [
    body("privateKey")
        .not()
        .isEmpty()
        .withMessage("privateKey is required")
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

export const issueTXValidation: ValidationChain[] = [
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
