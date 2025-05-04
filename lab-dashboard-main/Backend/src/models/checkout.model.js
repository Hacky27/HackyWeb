// Updated Order Schema with support for multiple products
import mongoose, { Schema } from "mongoose";

// Schema for individual order items (products)
const orderItemSchema = new Schema({
  product: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  amount: {
    type: Number,
    required: true
  },
  accessPeriod: {
    type: String,
  }
}, { timestamps: true });

// Main order schema
const orderSchema = new Schema({
  // Array of order items (products)
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: function (items) {
        return items && items.length > 0;
      },
      message: "At least one product item is required"
    }
  },
  // Order totals
  totalAmount: {
    type: Number,
    required: true
  },
  // Order status
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "success"
  },
  // // Customer information
  // customer: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // },
  // // Payment information
  // paymentMethod: {
  //   type: String,
  //   required: true
  // },
  // transactionId: String,
  // // Additional notes
  // notes: String
}, { timestamps: true });

// Virtual for calculating total amount
orderSchema.virtual('calculatedTotalAmount').get(function () {
  return this.items.reduce((total, item) => total + item.amount, 0);
});

// Pre-save middleware to set totalAmount if not provided
orderSchema.pre('save', function (next) {
  if (!this.totalAmount) {
    this.totalAmount = this.calculatedTotalAmount;
  }
  next();
});

export const Order = mongoose.model("Order", orderSchema);