"use client";
import React from "react";
import Details from "@/components/Details";
import { motion } from "framer-motion";
import {useState} from "react";
import {
    Send,
    Wallet,
    UserPlus,
    CheckCircle,
    Clock,
    XCircle,
} from "lucide-react";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const card = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4 },
    },
};

const About = () => {
     const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-blue-200">
              {/* MOBILE MENU BUTTON */}
              <button
                onClick={() => setShowDetails(true)}
                className="lg:hidden absolute top-1 left-4 z-40 bg-indigo-500 text-white px-3 py-2 rounded-lg shadow"
              >
                ☰
              </button>
            
              {/* DESKTOP SIDEBAR */}
              <div className="hidden lg:block">
                <Details />
              </div>
            
              {/* MOBILE SIDEBAR */}
              {showDetails && (
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 z-50 flex"
                >
                  {/* overlay */}
                  <div
                    className="absolute inset-0 bg-black/40"
                    onClick={() => setShowDetails(false)}
                  ></div>
            
                  {/* sidebar */}
                  <div className="relative z-50 no-scrollbar h-full">
                    <Details />
            
                    {/* close button */}
                    <button
                      onClick={() => setShowDetails(false)}
                      className="fixed top-4 left-[75vw] sm:left-[40vw] z-[100] bg-red-500 text-white px-3 py-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              )}

            <div className="flex-1 p-8 mt-4 lg:mt-0 max-w-5xl mx-auto">

                {/* TITLE */}

                <motion.h1
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-2xl sm:text-4xl font-bold text-slate-800 mb-6"
                >
                    💸 About This App
                </motion.h1>

                {/* INTRO */}

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-600 text-lg mb-10 leading-relaxed"
                >
                    This platform is a peer-to-peer payment system where users can
                    send money, request money, confirm payments, or reject requests
                    through a simple chat-style interface.
                </motion.p>

                {/* HOW TO USE */}

                <motion.h2
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-2xl font-semibold mb-6 text-slate-800">
                    🚀 How To Use
                </motion.h2>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid md:grid-cols-2 gap-6 mb-12"
                >
                    {/* ADD USER */}

                    <motion.div
                        variants={card}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white p-6 rounded-2xl shadow-lg"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <UserPlus className="text-indigo-600" />
                            <h3 className="font-semibold text-lg">Add Connection</h3>
                        </div>

                        <p className="text-slate-600 text-sm">
                            Enter a user's email from the navbar.
                            If the user exists, the connection is created.
                        </p>
                    </motion.div>

                    {/* PAYMENT */}

                    <motion.div
                        variants={card}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white p-6 rounded-2xl shadow-lg"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Wallet className="text-green-600" />
                            <h3 className="font-semibold text-lg">Send Payment</h3>
                        </div>

                        <p className="text-slate-600 text-sm">
                            Use command: <b>pay amount</b>
                            Example: <b>pay 250</b>
                        </p>
                    </motion.div>

                    {/* REQUEST */}

                    <motion.div
                        variants={card}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white p-6 rounded-2xl shadow-lg"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Send className="text-blue-600" />
                            <h3 className="font-semibold text-lg">Request Money</h3>
                        </div>

                        <p className="text-slate-600 text-sm">
                            Use command: <b>send amount</b>
                            The receiver can accept or reject it.
                        </p>
                    </motion.div>

                    {/* HISTORY */}

                    <motion.div
                        variants={card}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white p-6 rounded-2xl shadow-lg"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <CheckCircle className="text-purple-600" />
                            <h3 className="font-semibold text-lg">Transaction History</h3>
                        </div>

                        <p className="text-slate-600 text-sm">
                            Track all requests, payments, and confirmations easily.
                        </p>
                    </motion.div>
                </motion.div>

                {/* STATUS GUIDE */}

                <motion.h2
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-2xl font-semibold mb-6 text-slate-800">
                    📊 Transaction Status
                </motion.h2>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid md:grid-cols-2 gap-6"
                >
                    <motion.div
                        variants={card}
                        whileHover={{ scale: 1.05 }}
                        className="bg-yellow-100 p-5 rounded-xl flex gap-3"
                    >
                        <Clock className="text-yellow-600" />
                        <div>
                            <h3 className="font-semibold">Status 0 — Pending</h3>
                            <p className="text-sm">
                                Request sent but not yet accepted or rejected.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={card}
                        whileHover={{ scale: 1.05 }}
                        className="bg-blue-100 p-5 rounded-xl flex gap-3"
                    >
                        <CheckCircle className="text-blue-600" />
                        <div>
                            <h3 className="font-semibold">Status 1 — Confirmed</h3>
                            <p className="text-sm">
                                Payment confirmed manually (cash or external app).
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={card}
                        whileHover={{ scale: 1.05 }}
                        className="bg-red-100 p-5 rounded-xl flex gap-3"
                    >
                        <XCircle className="text-red-600" />
                        <div>
                            <h3 className="font-semibold">Status 2 — Rejected</h3>
                            <p className="text-sm">
                                Receiver rejected the payment request.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={card}
                        whileHover={{ scale: 1.05 }}
                        className="bg-green-100 p-5 rounded-xl flex gap-3"
                    >
                        <Wallet className="text-green-600" />
                        <div>
                            <h3 className="font-semibold">Status 3 — Direct Payment</h3>
                            <p className="text-sm">
                                Payment completed directly using the app gateway.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* FOOTER */}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 text-center text-slate-600 text-sm"
                >
                    Built for simple and transparent peer-to-peer payments.
                </motion.div>

            </div>
        </div>
    );
};

export default About;