import { Connect } from "../models/connect.models.js";
import {User} from "../models/user.models.js";
import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const connectUsers=asyncHandler(async(req,res,next)=>{
    const user1=req.user._id;
    const email=req.user.email;
    const {user2}=req.body;

    if(!user2){
        return res.status(400).json(new ApiError(400,"User2 is required"));
    }

    if(email === user2){
        return res.status(400).json(new ApiError(400,"You cannot connect with yourself"));
    }
    const user2Data=await User.find({email:user2});

    if(!user2Data || user2Data.length === 0){
        return res.status(404).json(new ApiError(404,"Email  not found"));
    }
    const ID=user2Data[0]._id;
    const existingConnect=await Connect.findOne({$or:[
        {user1,user2:ID},
        {user1:ID,user2:user1}
    ]});

    if(existingConnect){
        return res.status(400).json(new ApiError(400,"You are already connected with this user"));
    }
    const newConnect=new Connect({user1,user2:ID});
    await newConnect.save();

    return res.status(201).json(new ApiResponse(201,newConnect,"Users connected successfully"));
})

const getConnections=asyncHandler(async(req,res,next)=>{
    const userId=req.user._id;
    const connections=await Connect.find({$or:[
        {user1:userId},
        {user2:userId}
    ]}).populate("user1","email username").populate("user2","email username").sort({createdAt:-1});
    return res.status(200).json(new ApiResponse(200,connections,"Connections fetched successfully"));
})

export {connectUsers,getConnections}