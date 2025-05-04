// routes/machineForm.route.js
import express from 'express';
import {
    findAll,
    fetchMachineFormsByProduct,
    saveMachineForm,
    deleteMachineFormById,
    deleteMachineFormsByProduct,
    addAnswerToMachineFormById,
} from '../controllers/machineForm.controller.js';

const router = express.Router();

// Get all machine forms
router.get('/', findAll);

// Get machine forms by product
router.get('/product/:product', fetchMachineFormsByProduct);

// Save a single machine form (always creates a new entry)
router.post('/save', saveMachineForm);

// Delete a specific machine form by ID
router.delete('/:id', deleteMachineFormById);

// Delete all machine forms for a product (keeping for backward compatibility)
router.delete('/product/:product', deleteMachineFormsByProduct);

router.post('/:id/answer', addAnswerToMachineFormById);
export { router };