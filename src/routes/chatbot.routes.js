import { Router } from 'express';
import {  sendMessage, startChat } from '../controllers/chatbot.controller.js';
import {authMiddleware} from "../middlewares/auth.middleware.js";

const router = Router();


router.use(authMiddleware);

router.post("/start", startChat);
router.post("/message", sendMessage);


export default router;          