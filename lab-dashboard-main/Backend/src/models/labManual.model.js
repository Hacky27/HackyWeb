// 3. Lab Manual Form Schema
import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema({
  task: {
    type: [String],
    required: true
  },
  solution: {
    type: String,
    required: true
  },
  imageurl: {
    type: String,
    default: ""
  }
});

const labManualFormSchema = new Schema({
  product: {
    type: String,
    required: true
  },
  labInstructions: {
    type: [String],
    required: true
  },
  tasks: [taskSchema]
}, { timestamps: true });

export const LabManualForm = mongoose.model("LabManualForm", labManualFormSchema);