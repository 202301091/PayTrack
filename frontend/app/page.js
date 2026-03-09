"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";


export default function Home() {
  const [agree, setagree] = useState(false)
  const router = useRouter();
  const [form, setform] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    if (localStorage.getItem("accessToken") && localStorage.getItem("username")) {
      router.push(`/Dashboard/${localStorage.getItem("ID")}`)
    }
  }, [])

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value })
  }



  const googleLogin1 = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        toast.info("Logging in with Google...");
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_HOST}/users/google-login`,
          {
            access_token: credentialResponse.access_token,
          }
        );

        localStorage.setItem("accessToken", res.data.data.accessToken);
        localStorage.setItem("username", res.data.data.user.username);
        localStorage.setItem("ID", res.data.data.user.id);
        toast.success("✅ Logged in successfully via Google!");
        router.push(`/Dashboard/${localStorage.getItem("ID")}`);
      } catch (err) {
        toast.error(`Google login failed: ${err.response?.data?.message || err.message}`);
      }
    },
    onError: () => toast.error("Google Login Failed. Please try again."),
  });


  const onSubmit = async () => {

    if (!agree) {
      toast.error("You must agree to receive transactional emails to proceed.");
      return;
    }
    // Handle form submission logic here
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    toast.info("Generating OTP and sending to your email...");
    localStorage.setItem("email", form.email);
    localStorage.setItem("password", form.password);
    try {
      const otpRes = await fetch(`${process.env.NEXT_PUBLIC_HOST}/otp/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: form.email })
      })
      if (!otpRes.ok) {
        let data = await otpRes.json();
        toast.error(`OTP generation failed: ${data.error}`);
      } else {
        toast.success("OTP sent to your email successfully!");
        setform({
          email: "",
          password: "",
        })
        router.push("/OTP/0")
      }
    } catch (err) {
      toast.error(`OTP generation failed: ${err.response?.data?.message || err.error}`);
    }
  }
  return (
    // ✅ Background stays SAME
    <div className="flex justify-center items-center min-h-screen py-2 ">

      {/* Card Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-[90vw] sm:min-w-[320px]  max-w-md flex flex-col gap-3 px-8 py-10 
                    bg-linear-to-br from-slate-100 via-indigo-100 to-blue-200
  backdrop-blur-md 
                   border border-slate-200 rounded-2xl shadow-xl"
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl sm:text-2xl font-bold text-slate-800 text-center mb-6"
        >
          Create a secure account
        </motion.h1>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-1"
        >
          <label className="text-sm font-medium text-slate-600">
            Email
          </label>
          <input
            onChange={(e) => handleChange(e)}
            type="email"
            name="email"
            value={form.email}
            placeholder="Enter your email"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 
                       focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-1"
        >
          <label className="text-sm font-medium text-slate-600">
            Password
          </label>
          <input
            type="password"
            name="password"
            onChange={(e) => handleChange(e)}
            value={form.password}
            placeholder="Enter your password"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 
                       focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <div className="flex items-center gap-2 mt-2">
            <input value={agree} onClick={() => setagree(!agree)} type="checkbox" id="agree" className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500" required />
            <label htmlFor="agree" className="text-sm text-slate-600">
              I agree to receive transactional emails related to my account.
            </label>
          </div>
        </motion.div>

        {/* Button */}
        <motion.button
          onClick={() => onSubmit()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 w-full py-3 rounded-xl
                     bg-gradient-to-r from-indigo-500 to-indigo-600
                     text-white font-semibold shadow-md
                     hover:shadow-lg transition"
        >
          Sign Up
        </motion.button>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-center text-slate-500 my-1"
        >
          OR
        </motion.p>
        <motion.button
          onClick={() => googleLogin1()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 rounded-xl
                     bg-gradient-to-r from-gray-500 to-gray-600
                     text-white font-semibold shadow-md
                     hover:shadow-lg transition "
        >
          <div className="flex gap-3 justify-center items-center ">
            <img className="w-10 h-10 " src="./G_Icon.png" alt="" />
            <p className="text-blue-200">Login with Google</p>
          </div>
        </motion.button>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-center text-slate-500 mt-4"
        >
          Already have an account?{" "}
          <span onClick={() => {
            toast.success("Redirect to the Sign In page")
            router.push("/Sign_in")
          }} className="text-indigo-600 font-medium hover:underline hover:cursor-pointer">
            Sign In
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
