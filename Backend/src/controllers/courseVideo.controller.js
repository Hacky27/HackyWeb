// controllers/courseVideo.controller.js
import { CourseVideoForm } from '../models/courseVideo.model.js';
import mongoose from 'mongoose';

// Get all course videos with product titles
const findAll = async (req, res) => {
  try {
    const courseVideos = await CourseVideoForm.aggregate([
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
          groups: 1,
          createdAt: 1,
          updatedAt: 1,
          productTitle: '$productDetails.title'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: courseVideos.length,
      data: courseVideos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Get course videos for a specific product
const fetchCourseVideoByProduct = async (req, res) => {
  try {
    const productId = req.params.product;

    const courseVideos = await CourseVideoForm.aggregate([
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
          groups: 1,
          createdAt: 1,
          updatedAt: 1,
          productTitle: '$productDetails.title'
        }
      }
    ]);

    // If no data exists, return an empty structure
    if (courseVideos.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: {
          product: productId,
          groups: []
        }
      });
    }

    res.status(200).json({
      success: true,
      count: courseVideos.length,
      data: courseVideos[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Save course videos (create or update)
const saveCourseVideos = async (req, res) => {
  try {
    const { product, groups } = req.body;

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product is required",
        error: "Missing product field"
      });
    }

    // Check if course video for this product already exists
    let courseVideo = await CourseVideoForm.findOne({ product });
    let isNewRecord = false;

    if (!courseVideo) {
      // Create new course video if not exists
      courseVideo = new CourseVideoForm({
        product,
        groups: groups || []
      });
      isNewRecord = true;
    } else {
      // Update existing course video
      courseVideo.groups = groups || [];
    }

    // Save the document
    await courseVideo.save();

    // Simplified response without the complex aggregation
    res.status(isNewRecord ? 201 : 200).json({
      success: true,
      data: courseVideo,
      message: isNewRecord
        ? "Course videos created successfully"
        : "Course videos updated successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// NEW FUNCTION: Add new course videos only (prevents duplicate products)
const addCourseVideos = async (req, res) => {
  try {
    const { product, groups } = req.body;

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product is required",
        error: "Missing product field"
      });
    }

    // Check if course video for this product already exists
    const existingCourseVideo = await CourseVideoForm.findOne({ product });

    if (existingCourseVideo) {
      return res.status(409).json({
        success: false,
        message: "Course videos already exist for this product",
        error: "Duplicate product",
        productId: product
      });
    }

    // Create new course video
    const newCourseVideo = new CourseVideoForm({
      product,
      groups: groups || []
    });

    // Save the document
    await newCourseVideo.save();

    res.status(201).json({
      success: true,
      data: newCourseVideo,
      message: "Course videos created successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// NEW FUNCTION: Update existing course videos only
const updateCourseVideos = async (req, res) => {
  try {
    const { product, groups } = req.body;

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product is required",
        error: "Missing product field"
      });
    }

    // Check if course video for this product exists
    const existingCourseVideo = await CourseVideoForm.findOne({ product });

    if (!existingCourseVideo) {
      return res.status(404).json({
        success: false,
        message: "No course videos found for this product",
        error: "Product not found",
        productId: product
      });
    }

    // Update existing course video
    existingCourseVideo.groups = groups || [];

    // Save the document
    await existingCourseVideo.save();

    res.status(200).json({
      success: true,
      data: existingCourseVideo,
      message: "Course videos updated successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Delete course videos for a product
const deleteCourseVideos = async (req, res) => {
  try {
    const productId = req.params.product;

    const result = await CourseVideoForm.deleteOne({ product: productId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No course videos found for this product'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course videos deleted successfully'
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
  fetchCourseVideoByProduct,
  saveCourseVideos,
  addCourseVideos,
  updateCourseVideos,
  deleteCourseVideos
};