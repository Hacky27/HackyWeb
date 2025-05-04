// routes/labManual.route.js
import express from 'express';
import {
    findAll,
    fetchLabManualByProduct,
    createLabManual,
    updateLabManual,
    saveLabManual,
    deleteLabManual
} from '../controllers/labManual.controller.js';

const router = express.Router();

// Get all lab manuals
router.get('/', findAll);

// Get lab manual by product
router.get('/product/:product', fetchLabManualByProduct);

// Create new lab manual
router.post('/create', createLabManual);

// Update existing lab manual
router.patch('/update', updateLabManual);

// Save lab manual (handles both create and update)
router.post('/save', saveLabManual);

// Delete lab manual for a product
router.delete('/product/:product', deleteLabManual);

export { router };