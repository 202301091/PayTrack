import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.models.js";


const authMiddleware=asyncHandler(async(req,res,next)=>{
    try{
      const token=req.headers.authorization?.split(" ")[1] || req.cookies.access_token;

      if(!token){
        return res.status(401).json(new ApiError(401,"Unauthorized: No token provided"));
      }

      const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        const user=await User.findById(decoded.id).select("-password -access_token -refresh_token");

        if(!user){
            return res.status(401).json(new ApiError(401,"Unauthorized: User not found"));
        }
        req.user=user;
        next();

    }catch(error){
        return res.status(401).json(new ApiError(401,"Unauthorized: Invalid token or token expired"));
    }
})

export default authMiddleware;