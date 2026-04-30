"use client"
import React, { useState, useEffect } from "react"
import Details from "@/components/Details.js"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle
} from "lucide-react"

const history = () => {
  const router = useRouter()
  const [Data, setData] = useState([])
  const [username, setUsername] = useState("")
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken")

    if (!token) {
      router.push(`/Sign_in`)
      return
    }

    setUsername(localStorage.getItem("username"))
    fetchDetails()
  }, [])

  const fetchDetails = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/transactions/history`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Failed to fetch payment history")
        return
      }

      setData(data.data)
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const getStatusUI = (tx, isSender) => {

    switch (tx.status) {

      // Payment (App payment OR confirmation)
      case 3:
      case 1:
        return {
          icon: isSender ? <ArrowUpRight /> : <ArrowDownLeft />,
          color: isSender ? "text-red-500" : "text-green-500",
          bg: isSender ? "bg-red-100" : "bg-green-100",
          text:
            tx.status === 3
              ? (isSender
                ? `Paid ₹${tx.amount} to ${tx.to.username}`
                : `Received ₹${tx.amount} from ${tx.from.username}`)
              : (isSender
                ? `Confirmed ₹${tx.amount} paid to ${tx.to.username}`
                : `${tx.from.username} confirmed ₹${tx.amount} payment`),
        }

      // Pending request
      case 0:
        return {
          icon: <Clock />,
          color: "text-yellow-600",
          bg: "bg-yellow-100",
          text: isSender
            ? `Payment request of ₹${tx.amount} sent`
            : `${tx.from.username} requested ₹${tx.amount}`,
        }

      // Rejected
      case 2:
        return {
          icon: <XCircle />,
          color: "text-red-600",
          bg: "bg-red-100",
          text: isSender
            ? `${tx.to.username} rejected your request of ₹${tx.amount}`
            : `You rejected ${tx.from.username}'s request of ₹${tx.amount}`,
        }

      default:
        return {}
    }
  }
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 to-indigo-100">


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

      <div className="flex-1 p-8  mt-5 lg:mt-0 overflow-y-auto">

        <h1 className="text-xl sm:text-3xl font-bold mb-6 text-gray-800">
          💳 Transaction History
        </h1>

        <div className="space-y-4">

          {Data.length === 0 && (
            <p className="text-gray-500">No transactions found</p>
          )}

          {Data.map((tx, index) => {

            const isSender = tx.from.username === username
            const statusUI = getStatusUI(tx, isSender)

            return (
              <motion.div
                key={tx._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="bg-white rounded-xl shadow-md p-2 sm:p-5 flex items-center justify-between hover:shadow-lg transition"
              >

                <div className="flex items-center gap-4">

                  <div className={`p-1 sm:p-3 rounded-full ${statusUI.bg}`}>
                    <div className={statusUI.color}>
                      {statusUI.icon}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium sm:font-semibold text-gray-800">
                      {statusUI.text}
                    </p>

                    <p className="text-sm text-gray-500">
                      Amount: ₹{tx.amount}
                    </p>

                    <p className="text-xs text-gray-400">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>

                </div>

                {tx.status === 3 && (
                  <div
                    className={`text-lg font-bold ${!isSender ? "text-red-500" : "text-green-500"
                      }`}
                  >
                    {!isSender ? "-" : "+"} ₹{tx.amount}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default history