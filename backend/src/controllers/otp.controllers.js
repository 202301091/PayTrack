import { Otp } from "../models/otp.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import crypto from "crypto";
import { sendWithGmail } from "../utils/mailer.js";
import { sendWithBrevo } from "../utils/mailer.js";
import { User } from "../models/user.models.js";
import { forgotWithGmail } from "../utils/forgot.js";
import { forgotWithBrevo } from "../utils/forgot.js";

const generateOtp = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json(new ApiError(400, "Email is required"));
    }

    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json(new ApiError(400, "User Already exits with this email"));
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otphash = crypto.createHash("sha256").update(otp).digest("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    let otpRecord = await Otp.findOne({ email });

    if (otpRecord) {
        otpRecord.otp = otphash;
        otpRecord.expiresAt = expiresAt;
        await otpRecord.save();
    } else {
        otpRecord = new Otp({ email, otp: otphash, expiresAt });
        await otpRecord.save();
    }

    if (process.env.NODE_ENV === "production") {
        await sendWithBrevo(email, otp);
    } else {
        await sendWithGmail(email, otp);
    }

    return res.status(200).json(new ApiResponse(200, null, "OTP sent to email successfully"));
})

const forgotPasswordOtp = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json(new ApiError(400, "Email is required"));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json(new ApiError(400, "No user found with this email"));
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otphash = crypto.createHash("sha256").update(otp).digest("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    let otpRecord = await Otp.findOne({ email });

    if (otpRecord) {
        otpRecord.otp = otphash;
        otpRecord.expiresAt = expiresAt;
        await otpRecord.save();
    } else {
        otpRecord = new Otp({ email, otp: otphash, expiresAt });
        await otpRecord.save();
    }

    if (process.env.NODE_ENV === "production") {
        await forgotWithBrevo(email, otp);
    }
    else {
        await forgotWithGmail(email, otp);
    }

    return res.status(200).json(new ApiResponse(200, null, "OTP sent to email successfully"));
})

const verifyOtp = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json(new ApiError(400, "Email and OTP are required"));
    }

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
        return res.status(400).json(new ApiError(400, "No OTP found for this email"));
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    if (hashedOtp !== otpRecord.otp) {
        return res.status(400).json(new ApiError(400, "Invalid OTP"));
    }

    if (otpRecord.expiresAt < new Date()) {
        return res.status(400).json(new ApiError(400, "OTP has expired"));
    }

    await Otp.deleteOne({ email });

    return res.status(200).json(new ApiResponse(200, null, "OTP verified successfully"));
})

export { generateOtp, verifyOtp, forgotPasswordOtp }