import {connectUsers,getConnections} from "../controllers/connect.controllers.js";
import authMiddleware from "../middleware/Auth.middleware.js";
import express from "express";

const router=express.Router();
router.use(authMiddleware);

router.post("/connect",connectUsers);
router.get("/connections",getConnections);

export default router;