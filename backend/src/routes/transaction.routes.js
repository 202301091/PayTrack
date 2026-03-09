import {createTransaction,transictionsHistory,specificUserTransactions,updateTransactionStatus} from "../controllers/transaction.controllers.js";
import authMiddleware from "../middleware/Auth.middleware.js";
import express from "express";


const router=express.Router();
router.use(authMiddleware);

router.post("/create",createTransaction);
router.get("/history",transictionsHistory);
router.get("/with/:otherUserId",specificUserTransactions);
router.put("/update/:transactionId",updateTransactionStatus);

export default router;