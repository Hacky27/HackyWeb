// Updated Course Video Form Schema
import mongoose, { Schema } from "mongoose";

// Schema for individual iframe entries
const iframeSchema = new Schema({
  iframe: {
    type: String,
    required: true
  }
});

// Group schema to organize videos
const groupSchema = new Schema({
  groupName: {
    type: String,
    default: function() {
      // This will generate "Group 1", "Group 2", etc.
      // The actual numbering should be handled by your frontend
      return "Group";
    }
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  iframes: {
    type: [iframeSchema],
    default: []
  }
});

// Main course video form schema
const courseVideoFormSchema = new Schema({
  product: {
    type: String,
    required: true
  },
  groups: {
    type: [groupSchema],
    default: []
  }
}, { timestamps: true });

export const CourseVideoForm = mongoose.model("CourseVideoForm", courseVideoFormSchema);