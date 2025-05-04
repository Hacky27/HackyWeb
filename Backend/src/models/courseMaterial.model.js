// 6. Course Material Schema
import mongoose, {Schema} from "mongoose";

const driveLinkSchema = new Schema({
    link: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v);  // Simple URL validation
        },
        message: props => `${props.value} is not a valid URL!`
      }
    }
  });
  
  const courseMaterialSchema = new Schema({
    product: {
      type: String,
      required: true
    },
    driveLinks: {
      type: [[driveLinkSchema]],  // Array of arrays of drive link objects
      required: true
    }
  }, { timestamps: true });
  
  export const CourseMaterial = mongoose.model("CourseMaterial", courseMaterialSchema);