// controllers/labManual.controller.js
import { LabManualForm } from '../models/labManual.model.js';
import mongoose from 'mongoose';

// Get all lab manuals with product titles
const findAll = async (req, res) => {
  try {
    const labManuals = await LabManualForm.aggregate([
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
          labInstructions: 1,
          tasks: 1,
          createdAt: 1,
          updatedAt: 1,
          productTitle: '$productDetails.title'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: labManuals.length,
      data: labManuals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Get lab manual for a specific product
const fetchLabManualByProduct = async (req, res) => {
  try {
    const productId = req.params.product;

    const labManuals = await LabManualForm.aggregate([
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
          labInstructions: 1,
          tasks: 1,
          createdAt: 1,
          updatedAt: 1,
          productTitle: '$productDetails.title'
        }
      }
    ]);

    // If no data exists, return an empty structure
    if (labManuals.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: {
          product: productId,
          labInstructions: [],
          tasks: []
        }
      });
    }

    res.status(200).json({
      success: true,
      count: labManuals.length,
      data: labManuals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Create new lab manual
const createLabManual = async (req, res) => {
  try {
    const { product, labInstructions, tasks } = req.body;

    console.log("Received tasks:", JSON.stringify(tasks, null, 2));

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product is required",
        error: "Missing product field"
      });
    }

    // Check if lab manual for this product already exists
    const exists = await LabManualForm.findOne({ product });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Lab manual for this product already exists",
        error: "Duplicate entry"
      });
    }

    // Ensure each task has the imageurl property
    const processedTasks = tasks?.map(task => ({
      task: task.task || [],
      solution: task.solution || "",
      imageurl: task.imageurl || ""
    })) || [];

    // Create new lab manual with explicit task structure
    const labManual = new LabManualForm({
      product,
      labInstructions: labInstructions || [],
      tasks: processedTasks
    });

    // Save the document
    await labManual.save();

    res.status(201).json({
      success: true,
      data: labManual,
      message: "Lab manual created successfully"
    });
  } catch (error) {
    console.error("Error creating lab manual:", error);
    res.status(400).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Update existing lab manual
const updateLabManual = async (req, res) => {
  try {
    const { product, labInstructions, tasks } = req.body;

    console.log("Update - Received tasks:", JSON.stringify(tasks, null, 2));

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product is required",
        error: "Missing product field"
      });
    }

    // Find lab manual for this product
    const labManual = await LabManualForm.findOne({ product });

    if (!labManual) {
      return res.status(404).json({
        success: false,
        message: "Lab manual not found for this product",
        error: "Not found"
      });
    }

    // Ensure each task has the imageurl property
    const processedTasks = tasks?.map(task => ({
      task: task.task || [],
      solution: task.solution || "",
      imageurl: task.imageurl || ""
    })) || [];

    // Update fields with explicit task structure
    labManual.labInstructions = labInstructions || labManual.labInstructions;
    labManual.tasks = processedTasks;

    // Save the updated document
    await labManual.save();

    res.status(200).json({
      success: true,
      data: labManual,
      message: "Lab manual updated successfully"
    });
  } catch (error) {
    console.error("Error updating lab manual:", error);
    res.status(400).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Save lab manual (create or update)
const saveLabManual = async (req, res) => {
  try {
    const { product, labInstructions, tasks } = req.body;

    console.log("Save - Received tasks:", JSON.stringify(tasks, null, 2));

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product is required",
        error: "Missing product field"
      });
    }

    // Ensure each task has the imageurl property
    const processedTasks = tasks?.map(task => ({
      task: task.task || [],
      solution: task.solution || "",
      imageurl: task.imageurl || ""
    })) || [];

    // Check if lab manual for this product already exists
    let labManual = await LabManualForm.findOne({ product });
    let isNewRecord = false;

    if (!labManual) {
      // Create new lab manual if not exists
      labManual = new LabManualForm({
        product,
        labInstructions: labInstructions || [],
        tasks: processedTasks
      });
      isNewRecord = true;
    } else {
      // Update existing lab manual
      labManual.labInstructions = labInstructions || [];
      labManual.tasks = processedTasks;
    }

    // Save the document
    await labManual.save();

    // Simplified response without the complex aggregation
    res.status(isNewRecord ? 201 : 200).json({
      success: true,
      data: labManual,
      message: isNewRecord
        ? "Lab manual created successfully"
        : "Lab manual updated successfully"
    });
  } catch (error) {
    console.error("Error saving lab manual:", error);
    res.status(400).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Delete lab manual for a product
const deleteLabManual = async (req, res) => {
  try {
    const productId = req.params.product;

    const result = await LabManualForm.deleteOne({ product: productId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No lab manual found for this product'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lab manual deleted successfully'
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
  fetchLabManualByProduct,
  createLabManual,
  updateLabManual,
  saveLabManual,
  deleteLabManual
};