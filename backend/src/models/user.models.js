import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema=new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    username:{type:String,required:true},
    razorpay_id:{type:String,default:""},
    profile_pic:{type:String,default:"https://m.media-amazon.com/images/I/81tA-ixFpdL._AC_UF1000,1000_QL80_.jpg"},
    razorpay_secret:{type:String,default:""},
    access_token:{type:String,default:""},
    refresh_token:{type:String,default:""},
    
},{timestamps:true})


userSchema.methods.ispasswordMatch=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}


userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10)
    }
    next()
})


userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        id:this._id,
        email:this.email,
        username:this.username
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}   

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        id:this._id,
        email:this.email,
        username:this.username
    },process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
}
    
export const User=mongoose.model("User",userSchema)