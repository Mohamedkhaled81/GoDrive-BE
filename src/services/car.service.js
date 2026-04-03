import Car from "../models/car.model.js";
import CustomError from "../utils/customError.js";
import "../models/user.model.js"
export const getCarService = async (carId) => {
    const car = await Car.findById(carId).populate("createdBy");

    if (!car) {
        throw new CustomError("Car not found", 404);
    }

    return car;
};

export const createCarService = async (userId, carData) => {
    const car = await Car.create({
        ...carData,
        createdBy: userId,
    });

    return car.populate("createdBy");
};

export const updateCarService = async (carId, carData) => {
    const car = await Car.findByIdAndUpdate(carId, carData, {
        returnDocument: "after",
    }).populate("createdBy");

    if (!car) {
        throw new CustomError("Car not found", 404);
    }

    return car;
};

export const deleteCarService = async (carId) => {
    const car = await Car.findByIdAndDelete(carId);

    if (!car) {
        throw new CustomError("Car not found", 404);
    }

    return true;
};

export const getAllCarsService = async () => {
    const cars = await Car.find().populate("createdBy");
    return cars;
};
