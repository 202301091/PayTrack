"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import {toast} from "react-toastify"
import { useRouter } from "next/navigation"
const Page = () => {
   const router=useRouter();
  const [email, setEmail] = useState("")
  
  const submit = async() => {
    try{
        const res=await  fetch(`${process.env.NEXT_PUBLIC_HOST}/otp/forgot-password`,{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({email})
        })
        let data=await res.json();
        if(!res.ok){
            toast.error(`Failed to send OTP: ${data.error}`);
        }else{
            localStorage.setItem("email",email);
            toast.success("OTP sent successfully! Please check your email.");
            router.push(`/OTP/1`);
        }
    }catch(err){
        toast.error(`Failed to send OTP: ${err.response?.data?.message || err.message}`);
    }
 }
  return (
    <div className="h-auto p-2 sm:min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-indigo-200 to-sky-300">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 w-[380px]"
      >

        {/* Title */}

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-slate-800 text-center mb-2"
        >
          Verify Your Email
        </motion.h2>

        <p className="text-center text-sm text-slate-500 mb-6">
          Enter your email to receive a verification OTP
        </p>

        {/* Email Input */}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-400 mb-5"
        />

        {/* Button */}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={()=>{
            submit()
          }}
          className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-500 to-sky-500 shadow-md"
        >
          Send OTP
        </motion.button>

        {/* Helper text */}

        <p className="text-xs text-slate-400 text-center mt-5">
          We'll send a one-time password to verify your account
        </p>

      </motion.div>
    </div>
  )
}

export default Page