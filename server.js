import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import { connectDb } from "./src/config/dbConfig.js";
import globalErrorHandler from "./src/middlewares/globalError.js";

import rootRouter from "./src/routes/index.js";
import carRouter from "./src/routes/car.routes.js";
import orderRouter from "./src/routes/order.routes.js";
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import userProfileRouter from "./src/routes/userProfile.routes.js";

dotenv.config();
import dns from "node:dns/promises";
import chatbotRoutes from "./src/routes/chatbot.routes.js";

dns.setServers(["1.1.1.1"]);

const app = express();
connectDb();
app.set("port", process.env.PORT || 5050);

const PORT = app.get("port");

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routers
app.use("/", rootRouter);
app.use('/goDrive/auth', authRoutes);
app.use('/goDrive/user', userRoutes);
app.use("/goDrive/profile", userProfileRouter);
app.use("/goDrive/cars", carRouter);
app.use('/goDrive/orders', orderRouter);
app.use('/goDrive/chatbot',chatbotRoutes)
// Global Custom-ErrorHandler
app.use(globalErrorHandler);

// Once The MongoDb is On We start the server..
mongoose.connection.once("open", () => {
    console.log("Connected to MongoDb :D");
    app.listen(PORT, () => {
        const servStatus = `Server Started at PORT http://localhost:${PORT} 😁`
        console.log(servStatus);
    });
});
