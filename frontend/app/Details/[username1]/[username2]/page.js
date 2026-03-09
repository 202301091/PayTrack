"use client";
import React, { useState, useEffect, useRef } from "react";
import Details from "@/components/Details.js";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

const DetailsPage = () => {
  const params = useParams();
  const owner =
    typeof window !== "undefined" ? localStorage.getItem("username") : "";
  const bottomRef = useRef(null);
  const [showDetails, setShowDetails] = useState(false);
  const [message, setmessage] = useState("");

  const [Data, setData] = useState({
    email: "",
    username: "",
    profile: "",
  });
  const [transactions, settransactions] = useState([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transactions]);

  useEffect(() => {
    fetchDetails();
    fetchTransactions();
  }, []);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchDetails = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/users/details/${params.username2}`
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      setData(data.data);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/payments/with/${params.username2}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      settransactions(data.data);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handlePayment = async (amount) => {
    const sdkLoaded = await loadRazorpay();

    if (!sdkLoaded) {
      toast.error("Razorpay failed to load");
      return;
    }
    try {
      const orderRes = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/payments/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(amount),
            creatorId: params.username2,
          }),
        }
      );

      const orderData = await orderRes.json();

      const { order, key_id } = orderData;

      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: Data.username,
        description: "User Payment",

        handler: async function (response) {
          const verifyRes = await fetch(
            `${process.env.NEXT_PUBLIC_HOST}/payments/verify-payment`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
              body: JSON.stringify({
                ...response,
                creatorId: params.username2,
              }),
            }
          );

          const data = await verifyRes.json();

          if (data.success) {
            transaction(amount);
            toast.success("Payment Successful 🎉");
            fetchTransactions();
          } else {
            toast.error("Verification failed");
          }
        },

        theme: {
          color: "#6366f1",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch {
      toast.error("Payment failed");
    }
  };

  const transaction = async (amount) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/transactions/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          to: params.username2,
          amount: amount,
          status: 3,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      }
      toast.success("Transaction successful");
      fetchTransactions();
    } catch (error) {
      toast.error("Transaction failed");
    }
  }

  const handleSend = async () => {
    const text = message.trim().toLowerCase();

    if (text.startsWith("pay ")) {
      const amount = Number(text.split(" ")[1]);

      if (!amount) {
        toast.error("Invalid amount");
        return;
      }

      handlePayment(amount);
      setmessage("");
      return;
    }

    if (text.startsWith("send ")) {
      const amount = Number(text.split(" ")[1]);

      if (!amount) {
        toast.error("Invalid amount");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/transactions/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          to: params.username2,
          amount: amount,
          status: 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      toast.success("Transaction request sent");
      setmessage("");
      fetchTransactions();

      return;
    }

    toast.info("Use 'pay 500' or 'send 500'");
  };


  const acceptRequest = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_HOST}/transactions/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ status: 1 }),
    });

    fetchTransactions();
  };

  const rejectRequest = async (id) => {
    const reason = prompt("Enter rejection reason");

    if (!reason) return;

    await fetch(`${process.env.NEXT_PUBLIC_HOST}/transactions/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        status: 2,
        description: reason,
      }),
    });

    fetchTransactions();
  };


  let balance = 0;

  transactions.forEach((tx) => {
    if (tx.status === 1 || tx.status === 3) {

      if (tx.from.username === owner) {
        balance += tx.amount;
      }

      if (tx.to.username === owner) {
        balance -= tx.amount;
      }

    }
  });


  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-200 via-indigo-200 to-sky-300">
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
      <div className="flex-1 flex flex-col mt-8 lg:mt-0 p-4">

        {/* HEADER */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center bg-white/70 p-3 rounded-2xl shadow"
        >
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 bg-indigo-500 rounded-full text-white flex items-center justify-center">
              {Data.username?.[0]?.toUpperCase()}
            </div>

            <div>
              <p className="font-semibold">{Data.username}</p>
              <p className="text-xs text-gray-500">{Data.email}</p>
            </div>
          </div>

          <div className="font-semibold">
            Balance: ₹ {balance}
          </div>
        </motion.div>

        {/* TRANSACTIONS */}

        <div className="flex-1 overflow-y-auto mt-4 space-y-3 no-scrollbar">

          {transactions
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((tx) => {

              const isSender = tx.from.username === owner;

              let color = "bg-indigo-100";

              if (tx.status === 0) color = "bg-yellow-100";
              if (tx.status === 1) color = "bg-green-100";
              if (tx.status === 2) color = "bg-red-100";
              if (tx.status === 3) color = "bg-blue-100";

              return (
                <motion.div
                  key={tx._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[80vw] sm:max-w-xs p-1 sm:p-3 rounded-xl shadow ${color} ${isSender ? "ml-auto" : ""
                    }`}
                >
                  <p className="font-semibold">₹ {tx.amount}</p>

                  {tx.description && (
                    <p className="text-sm">{tx.description}</p>
                  )}

                  <p className="text-xs text-gray-500">
                    {new Date(tx.date).toLocaleString()}
                  </p>

                  {tx.status === 0 && !isSender && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => acceptRequest(tx._id)}
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => rejectRequest(tx._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}

          <div ref={bottomRef}></div>
        </div>

        {/* INPUT */}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky bottom-0 bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow flex items-center gap-2"
        >
          <input
            value={message}
            onChange={(e) => setmessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            placeholder="pay <amount> to pay | send <amount> to request"
            className="flex-1 px-3 py-2 text-[10px] sm:text-sm rounded-xl bg-white outline-none"
          />

          <button
            onClick={handleSend}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-xl font-medium transition"
          >
            Send
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default DetailsPage;