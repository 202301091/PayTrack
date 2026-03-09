import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: String,
    date: {
      type: Date,
      default: Date.now,
    },
    //One number that indicates the status of the message(0-send message like i pay 500,1-confirm message like i receive 500,2-reject message like i cancel the payment,3-I pay rupees in you account)
    status: {
      type: Number,
      required: true,
    },  
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);