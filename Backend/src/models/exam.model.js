// models/exam.model.js
import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now
    },
    address: {
        type: String,
        trim: true
    },
    userId: {
        type: String,
        trim: true
    },
    productId: {
        type: String,
        trim: true
    },
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create a model from the schema
const Exam = mongoose.model('Exam', examSchema);

export default Exam;