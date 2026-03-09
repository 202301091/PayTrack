import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN || "http://localhost:3001", 
    credentials: true,
}))

app.use(express.json({limit:'20kb'})); //Use for parsing JSON bodies
app.use(express.urlencoded({extended:true, limit:'20kb'})); //Use for parsing URL-encoded bodies
app.use(express.static('public')); //Serve static files from the 'public' directory
app.use(cookieParser()); //Use for parsing cookies  

// Import routes

// User routes
import userRoutes from "./routes/user.routes.js";
app.use("/api/v1/users",userRoutes);

// OTP routes
import otpRoutes from "./routes/otp.routes.js";
app.use("/api/v1/otp",otpRoutes);

// Payment routes
import paymentRoutes from "./routes/transaction.routes.js";
app.use("/api/v1/payments",paymentRoutes);

// connection routes
import connectionRoutes from "./routes/connect.routes.js";
app.use("/api/v1/connections",connectionRoutes);

// payment routes
import transactionRoutes from "./routes/transaction.routes.js";
app.use("/api/v1/transactions",transactionRoutes);

export default app;