import mongoose from "mongoose";
import dotenv from "dotenv";

import { connectDb } from "./src/config/dbConfig.js";

import User from "./src/models/user.model.js";
import Car from "./src/models/car.model.js";
import Chat from "./src/models/chat.model.js";
import Order from "./src/models/order.model.js";

dotenv.config();

const seed = async () => {
    try {
        await connectDb();

        const user = await User.create({
            name: "Test User",
            email: "test@test.com",
            password: "123456",
            phone: "1234565"
        });

        const car = await Car.create({
            title: "BMW",
            pricePerDay: 100,
            location: "Cairo",
            createdBy: user._id,
        });

        await Chat.create({
            participants: [user._id],
            messages: [],
        });

        await Order.create({
            userId: user._id,
            carId: car._id,
            fromDate: new Date(),
            toDate: new Date(),
            totalPrice: 100,
        });

        console.log("Data inserted successfully");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seed();
