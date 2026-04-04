import express from "express";
import {
    createOrder,
    confirmOrder,
    getMyOrders,
    getAllOrders,
} from "../controllers/order.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { createOrderValidator } from "../validators/order.validator.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createOrderValidator, createOrder);

router.get("/my-orders", getMyOrders);

router.get("/", authorize("admin"), getAllOrders);

router.patch("/confirm/:id", confirmOrder);

export default router;
