// routes/faqs.route.js
import express from 'express';
import {
    findAll,
    fetchFaqsByProduct,
    saveFaqs,
    deleteFaqs, createFaqs, updateFaqs
} from '../controllers/faqs.controller.js';

const router = express.Router();

// Get all FAQs
router.get('/', findAll);

// Get FAQs by product
router.get('/product/:product', fetchFaqsByProduct);

// Save FAQs (handles both create and update)
router.post('/save', saveFaqs);

router.post('/create', createFaqs);

router.put('/update/:id', updateFaqs);
// Delete FAQs for a product
router.delete('/product/:product', deleteFaqs);

export { router };