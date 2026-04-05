import { body } from "express-validator";

export const createProfileValidator = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters"),

    body("phone")
        .optional()
        .isMobilePhone("ar-EG")
        .withMessage("Invalid Egyptian phone number"),

    body("profileImage")
        .optional()
        .isURL()
        .withMessage("Profile image must be a valid URL"),

    body("address")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Address is too short"),

    body("dateOfBirth")
        .optional()
        .isISO8601()
        .withMessage("Invalid date format"),

    body("balance")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Balance must be a positive number"),

    body("license.number").notEmpty().withMessage("License number is required"),

    body("license.expiryDate")
        .notEmpty()
        .withMessage("License expiry date is required")
        .isISO8601()
        .withMessage("Invalid expiry date format"),

    body("license.image")
        .optional()
        .isURL()
        .withMessage("License image must be a valid URL"),
];

export const updateProfileValidator = [
    body("name")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters"),

    body("phone")
        .optional()
        .isMobilePhone("ar-EG")
        .withMessage("Invalid Egyptian phone number"),

    body("profileImage")
        .optional()
        .isURL()
        .withMessage("Profile image must be a valid URL"),

    body("address")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Address is too short"),

    body("dateOfBirth")
        .optional()
        .isISO8601()
        .withMessage("Invalid date format"),

    body("balance")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Balance must be positive"),

    body("license.number")
        .optional()
        .notEmpty()
        .withMessage("License number cannot be empty"),

    body("license.expiryDate")
        .optional()
        .isISO8601()
        .withMessage("Invalid expiry date"),

    body("license.image")
        .optional()
        .isURL()
        .withMessage("License image must be a valid URL"),
];
