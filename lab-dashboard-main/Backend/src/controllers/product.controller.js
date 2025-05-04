// controllers/productDetails.controller.js
import { ProductDetails } from '../models/product.model.js';

// Create a new product
const create = async (req, res) => {
  try {
    const newProduct = new ProductDetails(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json({
      success: true,
      data: savedProduct,
      message: "Product created successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Get all products
const findAll = async (req, res) => {
  try {
    // Extract filter parameters from query
    const { title, bootcampAvailability, category, prices } = req.query;

    // Build filter object
    const filter = {};

    // Add filters if they exist in the query
    if (title) {
      // Case-insensitive partial match for title
      filter.title = { $regex: title, $options: 'i' };
    }

    if (bootcampAvailability) {
      filter.bootcampAvailability = bootcampAvailability;
    }

    if (category) {
      filter.category = category;
    }

    if (prices) {
      filter.prices = prices;
    }

    // Find products with applied filters
    const products = await ProductDetails.find(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};


// Get a single product by ID
const findOne = async (req, res) => {
  try {
    const product = await ProductDetails.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Update a product
const update = async (req, res) => {
  try {
    const updatedProduct = await ProductDetails.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Delete a product
const delete_ = async (req, res) => {
  try {
    const deletedProduct = await ProductDetails.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

export {
  create,
  findAll,
  findOne,
  update,
  delete_,
}