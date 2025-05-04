// 1. Product Details Schema
import mongoose, { Schema } from "mongoose"

// Creating a schema for access periods within course details
const accessPeriodSchema = new Schema({
  days: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  }
});

// Creating a schema for lab items within GCB labs
const labItemSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    // required: true
  }
});

// Creating a schema for on-demand labs
const onDemandLabSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  }
});

// Creating a schema for how learn items
const howLearnSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  points: {
    type: [String],
    required: true
  }
});

// Creating a schema for certification items
const certificationSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    // required: true
  }
});

// Main Product Details Schema
const productDetailsSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  prices: {
    type: String,
    enum: ['all_prices', 'discount_only'],
    default: 'all_prices'
  },
  bootcampAvailability: {
    type: String,
    enum: ['all_bootcamps', 'bootcamp_availability'],
    default: 'all_bootcamps'
  },
  courseDetails: {
    overview: {
      type: String,
      required: true
    },
    accessPeriod: [accessPeriodSchema],
    gcbLab: {
      image: {
        type: String,
        required: true
      },
      labs: [labItemSchema]
    },
    onDemandLab: [onDemandLabSchema]
  },
  termsAndConditions: {
    type: [String],
    required: true
  },
  howLearn: [howLearnSchema],
  certification: [certificationSchema],
  author: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    }
  }
}, { timestamps: true });

// module.exports = mongoose.model('ProductDetails', productDetailsSchema);
export const ProductDetails = mongoose.model("ProductDetails", productDetailsSchema);