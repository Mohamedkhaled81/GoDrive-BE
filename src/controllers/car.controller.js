import asyncHandler from "express-async-handler";
import {
    createCarService,
    deleteCarService,
    getCarService,
    updateCarService,
    getAllCarsService,
} from "../services/car.service.js";

export const getCar = asyncHandler(async (req, res) => {
    const { carId } = req.params;
    const car = await getCarService(carId);
    res.status(200).json({ car });
});

export const createCar = asyncHandler(async (req, res) => {
    const car = await createCarService("69cf8fb3ffdd70aef8de5573", req.body);
    res.status(201).json({ car });
});

export const updateCar = asyncHandler(async (req, res) => {
    const { carId } = req.params;
    const car = await updateCarService(carId, req.body);
    res.status(200).json({ car });
});

export const deleteCar = asyncHandler(async (req, res) => {
    const { carId } = req.params;
    await deleteCarService(carId);
    res.status(200).json({ message: "Car deleted successfully" });
});

export const getAllCars = asyncHandler(async (req, res) => {
    const cars = await getAllCarsService();
    res.status(200).json({ cars });
});
