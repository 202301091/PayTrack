import {generateOtp,verifyOtp,forgotPasswordOtp} from "../controllers/otp.controllers.js";
import express from "express";

const router=express.Router();

router.post("/generate",generateOtp);
router.post("/verify",verifyOtp);
router.post("/forgot-password",forgotPasswordOtp);
export default router;