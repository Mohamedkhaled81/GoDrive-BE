import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import { connectDb } from "./src/config/dbConfig.js";
import rootRouter from "./src/routes/index.js";
import { fileURLToPath } from "url";
import globalErrorHandler from "./src/middlewares/globalError.js";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import handSocketIo from "./src/sockets/index.js"
import handleAuthSocket from "./src/sockets/middlewares/auth.middleware.js"

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Adding Cors for the Client-side Project...
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
connectDb();

app.set("port", process.env.PORT || 5050);
app.set("socketIo", io);

const PORT = app.get("port");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
io.use(handleAuthSocket);

// Routers
app.use("/", rootRouter);

// Global Custom-ErrorHandler
app.use(globalErrorHandler);

// Once The MongoDb is On We start the server..
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDb :D");

  // listen to a server..
  httpServer.listen(PORT, () => {
    const servStatus = `Server Started at http://localhost:${PORT}/ :D`;
    console.log(servStatus);
  });

  // io is our Socket.Io Server...
  handSocketIo(io);
});
