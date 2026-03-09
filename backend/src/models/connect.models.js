import mongoose from "mongoose";
const connectSchema = new mongoose.Schema({

    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

export const Connect = mongoose.model("Connect", connectSchema);