import express from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controllers.js";
import authMiddleware from "../middleware/Auth.middleware.js";
const router = express.Router();

router.use(authMiddleware);
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);

export default router;