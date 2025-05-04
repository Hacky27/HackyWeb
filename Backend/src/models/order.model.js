import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    orderItems: [
      {
        accessId: String,
        id: String,
        imageUrl: String,
        price: Number,
        quantity: Number,
        title: String,
        accessDays: String,
      },
    ],
    total: Number,
    razorpay: {
      orderId: String,
      paymentId: String,
      signature: String,
    },
    paymentDetails: {
      payment_id: String,
      currency: String,
      method: String,
      status: String,
    },

  },
  { timestamps: true }
);

// 🛡️ Check before defining model
const Orderpay = mongoose.models.Orderpay || mongoose.model("Orderpay", orderSchema);

export default Orderpay;
