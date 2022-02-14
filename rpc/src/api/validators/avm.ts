import {body, ValidationChain} from "express-validator";

export const sendValidation: ValidationChain[] = [
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
    body("assetID")
        .not()
        .isNumeric()
        .withMessage("assetID is required")
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

export const sendNFTValidation: ValidationChain[] = [
    body("to")
        .not()
        .isEmpty()
        .withMessage("to is required")
        .trim(),
    body("groupID")
        .not()
        .isEmpty()
        .withMessage("groupID is required")
        .trim(),
    body("assetID")
        .not()
        .isNumeric()
        .withMessage("assetID is required")
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
