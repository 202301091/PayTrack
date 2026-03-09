"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Add_User from "./Add_User.js";
import { usePathname } from "next/navigation";
import { set } from "mongoose";
const Details = () => {
  const router = useRouter();
  const [username, setusername] = useState("")
  const [ID, setID] = useState("")
  const [toggle, settoggle] = useState(false)
  const pathname = usePathname();
  const [profilePic, setProfilePic] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png");
  const logout = () => {
    localStorage.clear();
    toast.success("Logged out successfully 👋");
    router.push("/Sign_in")
  }

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      router.push(`/Sign_in`)
    }
    setusername(localStorage.getItem("username"))
    setID(localStorage.getItem("ID"))
    setProfilePic(localStorage.getItem("profile_pic"));
  },)


  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="
       w-[90vw] sm:w-[50vw] lg:w-[25vw]   h-full absolute lg:relative
        bg-white/60 backdrop-blur-md
        border-r border-white/30 overflow-y-auto
        p-5 flex flex-col gap-8 shadow-xl
      "
    >
      {toggle && <Add_User onClose={() => settoggle(false)} />}
      {/* Profile */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-4 items-center"
      >
        <img
          className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-300"
          src={profilePic}
          alt="profile"
        />
        <div>
          <h1 className="font-semibold text-lg text-slate-800">
            {username}
          </h1>
          <p className="text-sm text-slate-500">Admin</p>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex flex-col gap-3 mt-6">

        <motion.button
          whileHover={{ scale: 1.05, x: 6 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => {
            toast.info("Redirecting to Dashboard");
            router.push(`/Dashboard/${ID}`)
          }}
          className="
            w-full text-left px-4 py-3 rounded-xl
            text-slate-700 font-medium
            bg-white/50
            hover:bg-gradient-to-r 
            hover:from-indigo-400 hover:to-sky-400
            hover:text-white
            transition-all duration-300
            shadow-sm hover:shadow-md
          "
        >
          Dashboard
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, x: 6 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => {
            toast.info("Redirecting to Payment Page");
            router.push(`/payment/${ID}`)
          }}
          className="
            w-full text-left px-4 py-3 rounded-xl
            text-slate-700 font-medium
            bg-white/50
            hover:bg-gradient-to-r 
            hover:from-indigo-400 hover:to-sky-400
            hover:text-white
            transition-all duration-300
            shadow-sm hover:shadow-md
          "
        >
          Payment
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, x: 6 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => {
            toast.info("Redirecting to History ");
            router.push(`/history/${ID}`)
          }}
          className="
            w-full text-left px-4 py-3 rounded-xl
            text-slate-700 font-medium
            bg-white/50
            hover:bg-gradient-to-r 
            hover:from-indigo-400 hover:to-sky-400
            hover:text-white
            transition-all duration-300
            shadow-sm hover:shadow-md
          "
        >
          History
        </motion.button>

        {pathname === `/payment/${ID}` && (
          <motion.button
            whileHover={{ scale: 1.05, x: 6 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            onClick={() => {
              settoggle(!toggle)
            }}
            className="
      w-full text-left px-4 py-3 rounded-xl
      text-slate-700 font-medium
      bg-white/50
      hover:bg-gradient-to-r 
      hover:from-indigo-400 hover:to-sky-400
      hover:text-white
      transition-all duration-300
      shadow-sm hover:shadow-md
    "
          >
            Add User
          </motion.button>
        )}

        <motion.button
          onClick={() => {
            toast.info('Redirect to About Page')
            router.push('/About')
          }}
          whileHover={{ scale: 1.05, x: 6 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="
            w-full text-left px-4 py-3 rounded-xl
            text-slate-700 font-medium
            bg-white/50
            hover:bg-gradient-to-r 
            hover:from-indigo-400 hover:to-sky-400
            hover:text-white
            transition-all duration-300
            shadow-sm hover:shadow-md
          "
        >
          About Us
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, x: 6 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          onClick={() => logout()}
          className="
            w-full text-left px-4 py-3 rounded-xl
            text-slate-700 font-medium
            bg-white/50
            hover:bg-gradient-to-r 
            hover:from-indigo-400 hover:to-sky-400
            hover:text-white
            transition-all duration-300
            shadow-sm hover:shadow-md
          "
        >
          Logout
        </motion.button>

      </div>
    </motion.div>
  );
};

export default Details;