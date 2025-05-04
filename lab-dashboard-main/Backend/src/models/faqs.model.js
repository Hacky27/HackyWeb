// 4. FAQs Schema
import mongoose, {Schema} from "mongoose";
const faqItemSchema = new Schema({
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
  });
  
  const faqsSchema = new Schema({
    product: {
      type: String,
      required: true
    },
    faqs: [faqItemSchema]
  }, { timestamps: true });
  
  export const Faqs = mongoose.model("Faqs", faqsSchema);