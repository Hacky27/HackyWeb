// routes/courseVideo.route.js
import express from 'express';
import {
    findAll,
    fetchCourseVideoByProduct,
    saveCourseVideos,
    addCourseVideos,
    updateCourseVideos,
    deleteCourseVideos
} from '../controllers/courseVideo.controller.js';

const router = express.Router();

// Get all course videos
router.get('/', findAll);

// Get course videos by product name
router.get('/product/:product', fetchCourseVideoByProduct);

// Save course videos (handles both create and update)
router.post('/save', saveCourseVideos);

// NEW ROUTE: Add new course videos (prevents duplicates)
router.post('/add', addCourseVideos);

// NEW ROUTE: Update existing course videos
router.put('/update', updateCourseVideos);

// Delete course videos for a product
router.delete('/product/:product', deleteCourseVideos);

export { router };