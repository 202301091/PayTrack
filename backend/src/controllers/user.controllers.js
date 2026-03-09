import {User} from "../models/user.models.js";
import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import  crypto from "crypto";
import axios from "axios";
import { profile } from "console";

const registerUser=asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json(new ApiError(400,"Email and password are required"));
    }

    const existingUser=await User.findOne({email});

    if(existingUser){
        return res.status(400).json(new ApiError(400,"User already exists with this email"));
    }

    const username=email.split("@")[0];

    const user=new User({email,password,username});
    await user.save();


    return res.status(201).json(new ApiResponse(201,{email:user.email}, "User registered successfully"));
})

const loginUser=asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body;
    
    if(!email || !password){
        return res.status(400).json(new ApiError(400,"Email and password are required"));
    }

    const user=await User.findOne({email});

    if(!user){
        return res.status(400).json(new ApiError(400,"Invalid email or password"));
    }

    const isMatch=await user.ispasswordMatch(password);

    if(!isMatch){
        return res.status(400).json(new ApiError(400,"Invalid email or password"));
    }

    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();
    user.access_token=accessToken;
    user.refresh_token=refreshToken;
    await user.save();

    return res.status(200).json(new ApiResponse(200,{user:{id:user._id,email:user.email,username:user.username,profile_pic:user.profile_pic},accessToken,refreshToken}, "User logged in successfully"));
})

const googleLogin=asyncHandler(async(req,res,next)=>{

    const {access_token}=req.body;

    if(!access_token){
        return res.status(400).json(new ApiError(400,"Google token is required"));
    }

      const googleRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const {email,name}=googleRes.data;
    let user=await User.findOne({email});
    if(!user){
      let password=crypto.randomBytes(20).toString("hex");
        user=new User({email,username:name,password});
        await user.save();
    }

    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();
    user.access_token=accessToken;
    user.refresh_token=refreshToken;
    await user.save();

    return res.status(200).json(new ApiResponse(200,{user:{id:user._id,email:user.email,username:user.username,profile_pic:user.profile_pic},accessToken,refreshToken}, "User logged in successfully via Google"));
})



const logoutUser=asyncHandler(async(req,res,next)=>{
    const user=req.user;
    user.access_token="";
    user.refresh_token="";
    await user.save();
    return res.status(200).json(new ApiResponse(200,null,"User logged out successfully"));
})


const getUserDetails=asyncHandler(async(req,res,next)=>{
    const user=req.user;
     
    const user2=await User.findById(user.id).select("-password -access_token -refresh_token");

    if(!user2){
        return res.status(404).json(new ApiError(404,"User not found"));
    }

    return res.status(200).json(new ApiResponse(200,{email:user2.email,username:user2.username,profile_pic:user2.profile_pic,razorpay_id:user2.razorpay_id,razorpay_secret:user2.razorpay_secret}, "User details fetched successfully"));
})

const updateUserDetails=asyncHandler(async(req,res,next)=>{
    const user=req.user;
    const {username,profile_pic,razorpay_id,razorpay_secret}=req.body;

    const user2=await User.findById(user.id);

    if(!user2){
        return res.status(404).json(new ApiError(404,"User not found"));
    }

    user2.username=username || user2.username;
    user2.profile_pic=profile_pic || user2.profile_pic;
    user2.razorpay_id=razorpay_id || user2.razorpay_id;
    user2.razorpay_secret=razorpay_secret || user2.razorpay_secret;
    await user2.save();

    return res.status(200).json(new ApiResponse(200,{email:user2.email,username:user2.username,profile_pic:user2.profile_pic,razorpay_id:user2.razorpay_id,razorpay_secret:user2.razorpay_secret}, "User details updated successfully"));
})



const getUserDetailsByObjectId=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const user=await User.findById(id).select("-password -access_token -refresh_token");

    if(!user){
        return res.status(404).json(new ApiError(404,"User not found"));
    }

    return res.status(200).json(new ApiResponse(200,{email:user.email,username:user.username,profile:user.profile_pic,razorpay_id:user.razorpay_id,razorpay_secret:user.razorpay_secret}, "User details fetched successfully"));
})

const newPassword=asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json(new ApiError(400,"Email and new password are required"));
    }

    const user=await User.findOne({email});
    if(!user){
        return res.status(404).json(new ApiError(404,"User not found"));
    }

    user.password=password;
    await user.save();

    return res.status(200).json(new ApiResponse(200,null,"Password updated successfully"));
})

export {registerUser,loginUser,logoutUser,googleLogin,getUserDetails,updateUserDetails,getUserDetailsByObjectId,newPassword};