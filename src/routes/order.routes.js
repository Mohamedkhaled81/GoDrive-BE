import express from "express";
import { 
  createOrder, 
  confirmOrder, 
  getMyOrders, 
  getAllOrders 
} from "../controllers/order.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();


router.use(authMiddleware);


router.post("/", authorize("user", "admin"), createOrder);

router.get("/my-orders", authorize("user", "admin"), getMyOrders);


router.get("/", authorize("admin"), getAllOrders);


router.patch("/confirm/:id", authorize("admin"), confirmOrder);

export default router;