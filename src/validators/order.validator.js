// validators/order.validator.js

import { body } from "express-validator";

export const createOrderValidator = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID"),

  body("carId")
    .notEmpty()
    .withMessage("Car ID is required")
    .isMongoId()
    .withMessage("Invalid Car ID"),

  body("fromDate")
    .notEmpty()
    .withMessage("From date is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  body("toDate")
    .notEmpty()
    .withMessage("To date is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  body("status")
    .optional()
    .isIn(["pending", "confirmed", "cancelled"])
    .withMessage("Invalid status"),
];