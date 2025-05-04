// controllers/courseMaterial.controller.js
import { CourseMaterial } from '../models/courseMaterial.model.js';
import mongoose from 'mongoose';

// Get all course materials with product titles
const findAll = async (req, res) => {
  try {
    const courseMaterials = await CourseMaterial.aggregate([
      {
        $addFields: {
          productObjectId: {
            $cond: {
              if: { $regexMatch: { input: "$product", regex: /^[0-9a-fA-F]{24}$/ } },
              then: { $toObjectId: "$product" },
              else: "$product"
            }
          }
        }
      },
      {
        $lookup: {
          from: 'productdetails',
          localField: 'productObjectId',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $unwind: {
          path: '$productDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          product: 1,
          driveLinks: 1,
          createdAt: 1,
          updatedAt: 1,
          productTitle: '$productDetails.title'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: courseMaterials.length,
      data: courseMaterials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Get course materials for a specific product
const fetchCourseMaterialByProduct = async (req, res) => {
  try {
    const productId = req.params.product;

    const courseMaterials = await CourseMaterial.aggregate([
      {
        $match: {
          product: productId
        }
      },
      {
        $addFields: {
          productObjectId: {
            $cond: {
              if: { $regexMatch: { input: "$product", regex: /^[0-9a-fA-F]{24}$/ } },
              then: { $toObjectId: "$product" },
              else: "$product"
            }
          }
        }
      },
      {
        $lookup: {
          from: 'productdetails',
          localField: 'productObjectId',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $unwind: {
          path: '$productDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          product: 1,
          driveLinks: 1,
          createdAt: 1,
          updatedAt: 1,
          productTitle: '$productDetails.title'
        }
      }
    ]);

    // If no data exists, return an empty structure
    if (courseMaterials.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: {
          product: productId,
          driveLinks: []
        }
      });
    }

    res.status(200).json({
      success: true,
      count: courseMaterials.length,
      data: courseMaterials[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Save course materials (create or update)
const saveCourseMaterials = async (req, res) => {
  try {
    const { product, driveLinks } = req.body;

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product is required",
        error: "Missing product field"
      });
    }

    // Check if course material for this product already exists
    let courseMaterial = await CourseMaterial.findOne({ product });
    let isNewRecord = false;

    if (!courseMaterial) {
      // Create new course material if not exists
      courseMaterial = new CourseMaterial({
        product,
        driveLinks: driveLinks || []
      });
      isNewRecord = true;
    } else {
      // Update existing course material
      courseMaterial.driveLinks = driveLinks || [];
    }

    // Save the document
    await courseMaterial.save();

    // Simplified response without the complex aggregation
    res.status(isNewRecord ? 201 : 200).json({
      success: true,
      data: courseMaterial,
      message: isNewRecord
        ? "Course materials created successfully"
        : "Course materials updated successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Create new course material
const createCourseMaterial = async (req, res) => {
  try {
    const { product, driveLinks } = req.body;

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product is required",
        error: "Missing product field"
      });
    }

    // Check if course material for this product already exists
    const existingMaterial = await CourseMaterial.findOne({ product });

    if (existingMaterial) {
      return res.status(409).json({
        success: false,
        message: "Cannot create course material. Product already has materials. You can edit it instead.",
        error: "Duplicate record"
      });
    }

    // Create new course material
    const courseMaterial = new CourseMaterial({
      product,
      driveLinks: driveLinks || []
    });

    // Save the document
    await courseMaterial.save();

    res.status(201).json({
      success: true,
      data: courseMaterial,
      message: "Course materials created successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Update existing course material
const updateCourseMaterial = async (req, res) => {
  try {
    const { product } = req.params;
    const { driveLinks } = req.body;

    // Find existing course material by product ID
    const courseMaterial = await CourseMaterial.findOne({ product });

    if (!courseMaterial) {
      return res.status(404).json({
        success: false,
        message: "Course material not found",
        error: "Not found"
      });
    }

    // Update the driveLinks field
    courseMaterial.driveLinks = driveLinks || [];

    // Save the updated document
    await courseMaterial.save();

    res.status(200).json({
      success: true,
      data: courseMaterial,
      message: "Course materials updated successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Delete course materials for a product
const deleteCourseMaterials = async (req, res) => {
  try {
    const productId = req.params.product;

    const result = await CourseMaterial.deleteOne({ product: productId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No course materials found for this product'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course materials deleted successfully'
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
  findAll,
  fetchCourseMaterialByProduct,
  saveCourseMaterials,
  deleteCourseMaterials,
  createCourseMaterial,
  updateCourseMaterial
};