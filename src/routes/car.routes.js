import express from "express";
const router = express.Router();

import {
    getCar,
    createCar,
    updateCar,
    deleteCar,
    getAllCars,
} from "../controllers/car.controller.js";

import validateRequest from "../middlewares/validateRequest.js";

import {
    createCarValidator,
    updateCarValidator,
} from "../validators/car.validator.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

router
    .route("/")
    .get(getAllCars, validateRequest)
    .post(
        authMiddleware,
        authorize("admin"),
        createCarValidator,
        validateRequest,
        createCar,
    );

router
    .route("/:carId")
    .get(getCar, validateRequest)
    .patch(
        authMiddleware,
        authorize("admin"),
        updateCarValidator,
        validateRequest,
        updateCar,
    )
    .delete(authMiddleware, authorize("admin"), deleteCar);

export default router;