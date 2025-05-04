import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";

import Orderpay from "../models/order.model.js"; // updated import
import { instance } from "../config/razorpay.js";

dotenv.config();
const router = express.Router();

// Create Razorpay order
router.post("/create-order", async (req, res) => {
    try {
        const { fullName, email, orderItems, total } = req.body;

        const receiptId = crypto.randomBytes(10).toString("hex");

        const options = {
            amount: total * 100, // amount in paisa
            currency: "INR",
            receipt: receiptId,
            notes: {
                fullName,
                email,
            },
        };

        const order = await instance.orders.create(options);
        // Save order to DB
        const dbOrder = await Orderpay.create({
            fullName,
            email,
            orderItems,
            total: total,
            razorpay: {
                orderId: order.id, // <- THIS is important for later verification
            },
        });
        console.log("Order created in DB:", dbOrder,order);
        res.status(200).json({
            success: true,
            order,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post("/verify-payment", async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isValid = expectedSignature === razorpay_signature;

        if (!isValid) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        // Update the order with payment details
        console.log("Updating order with payment details...", razorpay_order_id, razorpay_payment_id, razorpay_signature);
        const updatedOrder =await Orderpay.findOneAndUpdate(
            { "razorpay.orderId": razorpay_order_id },
            {
              $set: {
                "razorpay.paymentId": razorpay_payment_id,
                "razorpay.signature": razorpay_signature,
                paymentDetails: {
                  payment_id: razorpay_payment_id,
                  currency: "INR",
                  method: "upi",
                  status: "paid",
                },
              },
            },
            { new: true }
          );
          
        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            order: updatedOrder,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get("/getkey", async (req, res) => {
    const razorpay_key_id = process.env.RAZORPAY_KEY_ID;
    return res.status(200).json({ razorpay_key_id });
});
router.get("/paid-orders", async (req, res) => {
    try {
      // Find orders that have paymentDetails.status exactly equal to "paid"
      const paidOrders = await Orderpay.find({ "paymentDetails.status": "paid" });
      
      res.status(200).json({
        success: true,
        orders: paidOrders,
      });
    } catch (err) {
      console.error("Error fetching paid orders:", err.message);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  });
  
  export default router;
export { router };
