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
        .trim(),
    body("sourceChain")
        .not()
        .isEmpty()
        .withMessage("sourceChain is required")
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

export const createAddressValidation: ValidationChain[] = [
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

export const UTXOValidation: ValidationChain[] = [
    body("addresses")
        .isArray()
        .not()
        .isEmpty()
        .withMessage("addresses is required")
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
