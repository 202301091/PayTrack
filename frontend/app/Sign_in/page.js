"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
export default function Home() {
  const router = useRouter();
  const [form, setform] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    if (localStorage.getItem("accessToken") && localStorage.getItem("username")) {
      router.push(`/Dashboard/${localStorage.getItem("username")}`)
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
        localStorage.setItem("profile_pic", res.data.data.user.profile_pic);

        toast.success("✅ Logged in successfully via Google!");
        router.push(`/Dashboard/${res.data.data.user.id}`);
      } catch (err) {
        toast.error("Google login failed");
      }
    },
    onError: () => toast.error("Google Login Failed. Please try again."),
  });

  const onSubmit = async () => {
    // Handle form submission logic here
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      })
      let data = await res.json();
      if (!res.ok) {
        toast.error(`Login failed: ${data.error} || "Please try again"`);
      } else {

        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("username", data.data.user.username);
        localStorage.setItem("ID", data.data.user.id);
        localStorage.setItem("profile_pic", data.data.user.profile_pic);

        toast.success("Login successfully!");
        router.push(`/Dashboard/${data.data.user.id}`)
      }
    } catch (err) {
      console.error(err);
      toast.error(`Login failed: ${err.response?.data?.message || err.error}`);
    }
    setform({
      email: "",
      password: "",
    })
  }
  return (
    // ✅ Background stays SAME
    <div className="flex justify-center items-center min-h-screen py-2 ">

      {/* Card Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sm:min-w-[320px] w-[90vw] max-w-md flex flex-col gap-3 px-8 py-10 
                    bg-linear-to-br from-slate-100 via-indigo-100 to-blue-200
  backdrop-blur-md 
                   border border-slate-200 rounded-2xl shadow-xl"
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-md sm:text-2xl font-bold text-slate-800 text-center mb-6"
        >
          Login to your dashboard
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
            type="email"
            placeholder="Enter your email"
            name="email"
            value={form.email}
            onChange={(e) => handleChange(e)}
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
            value={form.password}
            onChange={(e) => handleChange(e)}
            placeholder="Enter your password"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 
                       focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-right text-slate-500 mt-1 hover:underline hover:cursor-pointer"
          onClick={() => {
            toast.info("Redirecting to Forgot Password page");
            router.push("/Forgot_Password")
          }
          }
        >
          Forgot Password?
        </motion.p>
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
          Sign In
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
          onClick={() => {
            googleLogin1()
          }}
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
          Already have not an account?{" "}
          <span onClick={() => {
            toast.success("Redirect to the Sign Up page")
            router.push("/")
          }} className="text-indigo-600 font-medium hover:underline hover:cursor-pointer">
            Sign Up
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
