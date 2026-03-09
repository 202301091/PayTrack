import authMiddleware from "../middleware/Auth.middleware.js";
import {registerUser,loginUser,logoutUser,googleLogin,getUserDetails,updateUserDetails,getUserDetailsByObjectId,newPassword} from "../controllers/user.controllers.js";
import express from "express";

const router=express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout",authMiddleware,logoutUser);
router.post("/google-login",googleLogin);
router.get("/details",authMiddleware,getUserDetails);
router.put("/update",authMiddleware,updateUserDetails);
router.get("/details/:id",getUserDetailsByObjectId);
router.post("/new-password",newPassword);
export default router;