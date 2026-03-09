"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Details from "../../../components/Details.js";

const page = () => {
  const router = useRouter();
  const [username, setusername] = useState("");
  const [ID, setID] = useState("");
  const [collections, setcollections] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      router.push(`/Sign_in`);
    }

    setusername(localStorage.getItem("username") || "");
    setID(localStorage.getItem("ID") || "");
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/connections/connections`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to fetch user details");
        return;
      } else {
        setcollections(data.data);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex min-h-screen bg-gradient-to-br from-blue-200 via-indigo-200 to-sky-300"
    >
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

      {/* 🔹 SECOND DIV – CONNECTION LIST */}
      <div className="flex-1 mt-5 lg:mt-0 p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          Payment Connections
        </h1>

        {collections.length === 0 ? (
          <p className="text-slate-600">No connections found</p>
        ) : (
          <div className="grid gap-4 max-w-3xl">
            {collections.map((item) => {
              // ✅ Decide which user to show (NO logic change, inline only)
              const otherUser =
                item.user1?.username === username
                  ? item.user2
                  : item.user1;

              if (!otherUser) return null;

              return (
                <motion.div
                  key={item._id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    router.push(`/Details/${ID}/${otherUser._id}`)
                  }
                  className="
                    flex items-center gap-4
                    bg-white/70 backdrop-blur-md
                    p-4 rounded-xl shadow-sm
                    cursor-pointer
                    hover:shadow-md transition
                  "
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-lg">
                    {otherUser.username?.[0]?.toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h2 className="font-semibold text-slate-800">
                      {otherUser.username}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {otherUser.email}
                    </p>
                  </div>

                  {/* Arrow */}
                  <span className="text-indigo-500 text-xl">➜</span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default page;