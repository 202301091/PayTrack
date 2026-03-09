"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
const OTP = () => {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const params = useParams();
  const number = params.number;

  const handleSubmit = async () => {
    toast.info("Verifying OTP...");
    // Handle OTP submission logic here
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: localStorage.getItem("email"), otp })
      })
      let data = await res.json();
      if (!res.ok) {
        toast.error(`OTP verification failed: ${data.error}`);
      } else {
        toast.success("OTP verified successfully!");

        if (number == 1) {
          toast.success("OTP verified successfully! Please reset your password.");
          router.push(`/reset`);
          return;
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/users/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: localStorage.getItem("email"), password: localStorage.getItem("password") })
          })
          let data = await res.json();
          if (!res.ok) {
            toast.error(`Login failed: ${data.error} || "Please try again"`);
          }
          else {
            localStorage.removeItem("password");
            localStorage.removeItem("email");
            toast.success("Account created successfully!");
            router.push(`/Sign_in`);
          }
        } catch (err) {
          toast.error(`Account Creation failed: ${err.response?.data?.message || err.message}`);
        }
      }
    } catch (err) {
      toast.error(`OTP verification failed: ${err.response?.data?.message || err.error}`);
    }
  };

  const resendOtp = async () => {
    toast.info("Resending OTP...");
    let location;
    if (number == 0) {
      location = "generate";
    } else {
      location = "forgot-password";
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/otp/${location}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: localStorage.getItem("email") })
      })
      let data = await res.json();
      if (!res.ok) {
        toast.error(`OTP resend failed: ${data.error}`);
      } else {
        toast.success("OTP resent to your email successfully!");

      }
    } catch (err) {
      toast.error(`OTP resend failed: ${err.response?.data?.message || err.error}`);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen py-2 bg-gradient-to-br from-sky-100 to-indigo-200">
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          bg-white/70 backdrop-blur-md
          border border-white/30 shadow-xl
          flex flex-col items-center
          min-h-[50vh] min-w-[320px] w-[30vw]
          p-10 rounded-2xl gap-8
        "
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-slate-800"
        >
          Verify OTP
        </motion.h1>

        <p className="text-slate-600 text-center text-sm">
          Please enter the 6-digit OTP sent to your email
        </p>

        {/* OTP Input */}
        <motion.input
          whileFocus={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="
            bg-slate-100
            px-4 py-3 rounded-xl
            text-xl text-center tracking-widest
            border border-slate-300
            focus:outline-none focus:ring-2 focus:ring-indigo-400
            w-56
          "
          type="text"
          maxLength={6}
          name="otp"
          value={otp}
          placeholder="••••••"
          onChange={(e) => setOtp(e.target.value)}
        />

        {/* Submit Button */}
        <motion.button
          onClick={() => handleSubmit()}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="
            w-full py-3 rounded-xl
            bg-gradient-to-r from-indigo-500 to-indigo-600
            text-white font-semibold shadow-md
            hover:shadow-lg transition
          "
        >
          Verify OTP
        </motion.button>

        {/* Resend */}
        <motion.p
          onClick={() => { resendOtp() }}
          whileHover={{ scale: 1.05 }}
          className="
            text-sm font-medium text-indigo-600
            underline cursor-pointer
          "
        >
          Resend OTP
        </motion.p>
      </motion.div>
    </div>
  );
};

export default OTP;
