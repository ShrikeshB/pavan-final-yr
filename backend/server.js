// server.js (fixed for ES module)
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import Razorpay from "razorpay";
import MailRouter from "./Routes/MailRouter.js"
import connectDB from "./config/db.js";
import UserController from "./Controller/UserController.js";
import { enhanceHandler } from "./Controller/ImageEnhancerController.js";
import {
  billingHandler,
  hasActiveSubscription,
  getSubscriptionDetails,
} from "./Controller/BillingController.js";
import paypalRoute from "./Routes/paypalRoute.js";

// Load environment variables
dotenv.config();

const app = express();
app.use(cookieParser());

// Connect to the database
connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Your React frontend URL
    credentials: true, // Allow cookies to be sent
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Auth Routes
app.post("/api/user/login", UserController.login);
app.post("/api/user/signup", UserController.signup);
app.post("/api/user/checkForExistingEmail", UserController.checkForExistingEmail);
app.post("/api/user/checkForExistingEmailForForgetPassword", UserController.checkForExistingEmailForForgetPassword);
app.post("/api/user/updatePassword", UserController.updatePassword);
app.get("/api/user/verifytoken", UserController.verifytoken);
app.use("/api/mails", MailRouter);


// Test Route
app.get("/test", (req, res) => {
  console.log(process.env.REPLICATE_API_TOKEN);
  res.json({ message: "hello" });
});

// Image Upload
const upload = multer({ dest: "uploads/" });
app.post("/api/enhance", upload.single("image"), enhanceHandler);

// Logout
app.post("/api/logout", (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: false, // change to true in production with HTTPS
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// Billing Routes
app.post("/api/addBilling", billingHandler);
app.post("/api/hasActiveSubscription", hasActiveSubscription);
app.post("/api/getSubscriptionDetails", getSubscriptionDetails);

// PayPal Routes  
app.use("/paypal", paypalRoute);

const instance = new Razorpay({
  key_id: "rzp_test_K9TyacZ1arXQTM",
  key_secret: "baQDWiCp0FfBWbA3ZyrpnFQt",
});
app.post("/razorPay", async (req, res) => {
  const response = await instance.orders.create({
    amount: 50000,
    currency: "INR",
    receipt: "receipt#1",
  });

  console.log(response);
  res.send({
    id: response.id,
    currency: response.currency,
    amount: response.amount,
  });
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("\n--------------------------------------");
  console.log(`Server running on port ${PORT}`);
});
