// routes/courseMaterial.route.js
import express from 'express';
import {
    findAll,
    fetchCourseMaterialByProduct,
    saveCourseMaterials,
    deleteCourseMaterials,
    createCourseMaterial,
    updateCourseMaterial
} from '../controllers/courseMaterial.controller.js';

const router = express.Router();

// Get all course materials
router.get('/', findAll);

// Get course materials by product
router.get('/product/:product', fetchCourseMaterialByProduct);

// Save course materials (handles both create and update) - keeping this for backward compatibility
router.post('/save', saveCourseMaterials);

// New dedicated endpoint for creating course material
router.post('/add', createCourseMaterial);

// New dedicated endpoint for updating course material
router.put('/edit/:product', updateCourseMaterial);

// Delete course materials for a product
router.delete('/product/:product', deleteCourseMaterials);

export { router };