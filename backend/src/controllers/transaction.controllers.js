import { User } from "../models/user.models.js";
import { Transaction } from "../models/transaction.models.js";
import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createTransaction = asyncHandler(async (req, res) => {
  const { to, amount,status} = req.body;
  const from = req.user._id;

  // Validate input
  if (!to || !amount || status === undefined) {
    return res
      .status(400)
      .json(new ApiError(400, "Recipient, amount, and status are required"));
  }

  if (amount <= 0) {
    return res
      .status(400)
      .json(new ApiError(400, "Amount must be greater than 0"));
  }

  // Find recipient
  const recipient = await User.findById(to);

  if (!recipient) {
    return res
      .status(404)
      .json(new ApiError(404, "Recipient not found"));
  }

  // Prevent sending request to yourself
  if (recipient._id.toString() === from.toString()) {
    return res
      .status(400)
      .json(new ApiError(400, "You cannot create a transaction with yourself"));
  }

   let description;
   if(status===0){
    description=`Sent a transaction request of amount ${amount}`;
   }else if(status===3){
    description=`Paid amount ${amount} to recipient's account`;
   }
  const transaction = await Transaction.create({
    from,
    to: recipient._id,
    amount,
    description,
    status: 0, 
    date: new Date(),
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        transaction,
        "Transaction request created successfully"
      )
    );
});

const updateTransactionStatus = asyncHandler(async (req, res) => {
  const { transactionId} = req.params;
  const { status,description} = req.body;

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
        return res.status(404).json(new ApiError(404, "Transaction not found"));
    }
    if (transaction.to.toString() !== req.user._id.toString()) {
        return res.status(403).json(new ApiError(403, "You are not authorized to update this transaction"));
    }

    transaction.status = status;
    if(status===2){
        if(!description){
            return res.status(400).json(new ApiError(400, "Description is required when rejecting a transaction"));
        }
        transaction.description=description;
    }else{
        transaction.description=`Send a transaction of amount ${transaction.amount}`;
    }

    await transaction.save();
    return res.status(200).json(new ApiResponse(200, transaction, "Transaction status updated successfully"));
});

const transictionsHistory=asyncHandler(async(req,res,next)=>{
    const userId=req.user._id;
    
    // Send only amount,date,credit or debit ,and the other user's email and username not send the main user details
    const transactions=await Transaction.find({$or:[
        {from:userId},
        {to:userId}
    ]}).populate("from","email username").populate("to","email username").sort({createdAt:-1});
    return res.status(200).json(new ApiResponse(200,transactions,"Transactions fetched successfully"));
})

const specificUserTransactions=asyncHandler(async(req,res,next)=>{
    const userId=req.user._id;
    const {otherUserId}=req.params;

    
    const transactions=await Transaction.find({$or:[
        {from:userId,to:otherUserId},
        {from:otherUserId,to:userId}
    ]}).populate("from","email username").populate("to","email username").sort({createdAt:-1});

    return res.status(200).json(new ApiResponse(200,transactions,"Transactions with specific user fetched successfully"));
})

export {createTransaction,transictionsHistory,specificUserTransactions,updateTransactionStatus}