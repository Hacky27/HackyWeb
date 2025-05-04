import mongoose, { Schema } from "mongoose";

const machineFormSchema = new Schema(
  {
    product: {
      type: String,
      required: true,
    },
    machine: {
      type: String,
      required: true,
    },
    flag: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    answers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          type: Schema.Types.ObjectId,
          ref: "CheckoutUser", // optional: reference to User model

        },
        answer: {
          type: String,

        },
        submittedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export const MachineForm = mongoose.model("MachineForm", machineFormSchema);
