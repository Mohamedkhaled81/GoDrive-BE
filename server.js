import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import { connectDb } from "./src/config/dbConfig.js";
import rootRouter from "./src/routes/index.js";
import { fileURLToPath } from "url";
import globalErrorHandler from "./src/middlewares/globalError.js";
import path from "path";

import userProfileRouter from "./src/routes/userProfile.routes.js";
import carRouter from "./src/routes/car.routes.js";

dotenv.config();

const app = express();
connectDb();

app.set("port", process.env.PORT || 5050);

const PORT = app.get("port");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routers
app.use("/", rootRouter);
app.use("/goDrive/profile", userProfileRouter);
app.use("/goDrive/cars", carRouter);

// Global Custom-ErrorHandler
app.use(globalErrorHandler);

// Once The MongoDb is On We start the server..
mongoose.connection.once("open", () => {
    console.log("Connected to MongoDb :D");
    app.listen(PORT, () => {
        const servStatus = `Server Started at http://localhost:${PORT}/ :D`;
        console.log(servStatus);
    });
});
