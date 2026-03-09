import crypto from "crypto";
import createRazorpayInstance from "../utils/razorpay.js";
import { User } from "../models/user.models.js";
import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import e from "express";

// 1️⃣ Create Order
const createOrder = asyncHandler(async (req, res) => {
  try {
    const { amount, creatorId } = req.body;

    if (!amount || !creatorId) {
      return res.status(400).json(new ApiError(400, "Amount and Creator ID are required"));
    }

    // 🔎 Find creator
    const creator = await User.findById(creatorId);

    if (!creator) {
        return res.status(404).json(new ApiError(404, "Creator not found"));
    }

    // 🔐 Create Razorpay instance for that creator
    const razorpay = createRazorpayInstance(
      creator.razorpay_id,
      creator.razorpay_secret
    );

    const options = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
      key_id: creator.razorpay_id, 
    });

  } catch (error) {
    return res.status(404).json(new ApiError(400,error.message || "Order creation failed"));
  }
});

// 2️⃣ Verify Payment
const verifyPayment = asyncHandler(async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      creatorId,
    } = req.body;

    const creator = await User.findById(creatorId);

    if (!creator) {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", creator.razorpay_secret)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      // TODO: Save payment in DB here

        return res.status(200).json(new ApiResponse(200,null,"Payment verified successfully"));

    } else {
        return res.status(400).json(new ApiError(400,"Invalid payment signature"));
    }

  } catch (error) {
    console.error("Verification Error:", error);
    return res.status(400).json(new ApiError(400,error.message || "Payment verification failed"));
  }
});

export { createOrder, verifyPayment };