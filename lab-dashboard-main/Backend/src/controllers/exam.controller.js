// controllers/exam.controller.js
import { CheckoutUser } from '../models/checkoutUser.model.js';
import Exam from '../models/exam.model.js';

// Create a new exam entry
// const createExam = async (req, res) => {
//     try {
//         const { name, date,address } = req.body;

//         // Validate request
//         if (!name) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Name is required",
//                 error: "Missing required field"
//             });
//         }

//         // Create new exam entry
//         const exam = new Exam({
//             name,
//             date: date || new Date(),
//             address
//         });

//         // Save to database
//         await exam.save();

//         // Return success response
//         res.status(201).json({
//             success: true,
//             data: exam,
//             message: "Exam entry created successfully"
//         });
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message,
//             error: error
//         });
//     }
// };
// Updated Route with userId

// Updated Controller Function
const createExam = async (req, res) => {
    try {
        const { name, date, address, productId } = req.body;
        const { userId } = req.params;

        // Validate request
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name is required",
                error: "Missing required field"
            });
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
                error: "Missing required parameter"
            });
        }

        // Create new exam entry with userId
        const exam = new Exam({
            name,
            date: date || new Date(),
            address,
            userId,
            productId
        });

        // Save to database
        await exam.save();

        // Find CheckoutUser by userId and update region based on address
        if (address) {

            // Find the CheckoutUser document by userId
            const checkoutUser = await CheckoutUser.findOne({
                _id:
                    userId
            });

            if (checkoutUser) {
                // Check if region field exists, if not, it will be created automatically
                // when we set the value (MongoDB/Mongoose behavior)
                checkoutUser.region = address;

                await checkoutUser.save();


            } else {

                // Not creating a new CheckoutUser as per requirement
            }
        }

        // Return success response
        res.status(201).json({
            success: true,
            data: exam,
            message: "Exam entry created successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            error: error
        });
    }
};
// Get all exam entries
const getAllExams = async (req, res) => {
    try {
        const exams = await Exam.find().sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: exams.length,
            data: exams
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        });
    }
};

// Get single exam entry by ID
const getExamById = async (req, res) => {
    try {
        const examId = req.params.id;

        const exam = await Exam.findById(examId);

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "Exam entry not found"
            });
        }

        res.status(200).json({
            success: true,
            data: exam
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        });
    }
};

// Export controller functions
export {
    createExam,
    getAllExams,
    getExamById
};