// routes/exam.route.js
import express from 'express';
import {
    createExam,
    getAllExams,
    getExamById
} from '../controllers/exam.controller.js';

const router = express.Router();

// POST /api/exams - Create a new exam entry
// router.post('/', createExam);
router.post('/:userId', createExam);

// GET /api/exams - Get all exam entries
router.get('/', getAllExams);

// GET /api/exams/:id - Get a single exam entry by ID
router.get('/:id', getExamById);

export { router };