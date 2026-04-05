import { body } from "express-validator";

export const createCarValidator = [
    body("title")
        .notEmpty()
        .withMessage("Car title is required")
        .isLength({ min: 2 })
        .withMessage("Title must be at least 2 chars"),

    body("pricePerDay")
        .notEmpty()
        .withMessage("Price per day is required")
        .isFloat({ gt: 0 })
        .withMessage("Price must be a positive number"),

    body("location")
        .notEmpty()
        .withMessage("Location is required")
        .isLength({ min: 2 })
        .withMessage("Location must be at least 2 characters"),

    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),

    body("images")
        .optional()
        .isArray()
        .withMessage("Images must be an array of URLs"),

    body("availability")
        .optional()
        .isArray()
        .withMessage("Availability must be an array of objects"),

    body("availability.*.fromDate")
        .optional()
        .isISO8601()
        .withMessage("fromDate must be a valid date"),

    body("availability.*.toDate")
        .optional()
        .isISO8601()
        .withMessage("toDate must be a valid date"),
];

export const updateCarValidator = [
    body("title")
        .optional()
        .notEmpty()
        .withMessage("Title cannot be empty")
        .isLength({ min: 2 })
        .withMessage("Title must be at least 2 chars"),

    body("pricePerDay")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Price must be a positive number"),

    body("location")
        .optional()
        .notEmpty()
        .withMessage("Location cannot be empty")
        .isLength({ min: 2 })
        .withMessage("Location must be at least 2 characters"),

    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),

    body("images")
        .optional()
        .isArray()
        .withMessage("Images must be an array of URLs"),

    body("availability")
        .optional()
        .isArray()
        .withMessage("Availability must be an array of objects"),

    body("availability.*.fromDate")
        .optional()
        .isISO8601()
        .withMessage("fromDate must be a valid date"),

    body("availability.*.toDate")
        .optional()
        .isISO8601()
        .withMessage("toDate must be a valid date"),
];
