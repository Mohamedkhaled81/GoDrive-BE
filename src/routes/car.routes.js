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

router
    .route("/")
    .get(getAllCars)
    .post(createCarValidator, validateRequest, createCar);

router
    .route("/:carId")
    .get(getCar)
    .patch(updateCarValidator, validateRequest, updateCar)
    .delete(deleteCar);

export default router;
