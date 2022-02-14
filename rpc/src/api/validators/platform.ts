import {body, ValidationChain} from "express-validator";

export const addDelegatorValidation: ValidationChain[] = [
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
    body("nodeID")
        .not()
        .isEmpty()
        .withMessage("nodeID is required")
        .trim()
];

export const addSubnetValidatorValidation: ValidationChain[] = [
    body("weight")
        .not()
        .isNumeric()
        .withMessage("weight is required")
        .trim(),
    body("subnetID")
        .not()
        .isEmpty()
        .withMessage("subnetID is required")
        .trim()
];

export const createSubnetValidation: ValidationChain[] = [
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
    body("threshold")
        .not()
        .isNumeric()
        .withMessage("threshold is required")
        .trim()
];

export const getCurrentValidatorsValidation: ValidationChain[] = [
    body("subnetID")
        .not()
        .isEmpty()
        .withMessage("subnetID is required")
        .trim(),
    body("nodeIDs")
        .not()
        .isArray()
        .withMessage("nodeIDs is required")
];
