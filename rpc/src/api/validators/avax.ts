import {body, ValidationChain} from "express-validator";

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
