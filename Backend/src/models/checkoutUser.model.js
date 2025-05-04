// checkoutUser.model.js
import mongoose, { Schema } from "mongoose";

const checkoutUserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        // Regular expression for email validation
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  order: [
    {
      type: String,
    }
  ],
  authToken: {
    token: String,
    expiresAt: Date
  },
  region: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

export const CheckoutUser = mongoose.model("CheckoutUser", checkoutUserSchema);