// routes/product.route.js
import express from 'express';
const router = express.Router();

import {
      create,
      findAll,
      findOne,
      update,
      delete_
} from "../controllers/product.controller.js";

// Create a new product
router.post('/', create);

// Get all products
router.get('/', findAll);

// Get a single product by ID
router.get('/:id', findOne);

// Update a product
router.patch('/:id', update);

// Delete a product
router.delete('/:id', delete_);

export { router };