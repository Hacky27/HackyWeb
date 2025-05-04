// controllers/machineForm.controller.js
import { MachineForm } from '../models/machineForm.model.js';
import mongoose from 'mongoose';

// Get all machine forms with product titles
const findAll = async (req, res) => {
  try {
    const machineForms = await MachineForm.aggregate([
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
          machine: 1,
          flag: 1,
          value: 1,
          createdAt: 1,
          updatedAt: 1,
          productTitle: '$productDetails.title'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: machineForms.length,
      data: machineForms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Get machine forms for a specific product
const fetchMachineFormsByProduct = async (req, res) => {
  try {
    const productId = req.params.product;

    // First, fetch the machine forms with basic sorting
    const machineForms = await MachineForm.aggregate([
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
          machine: 1,
          flag: 1,
          value: 1,
          answers: 1, 
          createdAt: 1,
          updatedAt: 1,
          productTitle: '$productDetails.title'
        }
      },
      {
        // Sort the machine forms by updatedAt/createdAt in descending order
        $sort: { 
          updatedAt: -1, 
          createdAt: -1 
        }
      }
    ]);

    // If no data exists, return an empty structure
    if (machineForms.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: {
          product: productId,
          machines: []
        }
      });
    }

    // Process the machine forms - safely handle sorting of answers
    const processedForms = machineForms.map(form => {
      try {
        // Only attempt to sort if answers exists, is an array, and has items
        if (form.answers && Array.isArray(form.answers) && form.answers.length > 0) {
          // Check the structure of answers to determine how to sort
          const firstAnswer = form.answers[0];
          
          if (typeof firstAnswer === 'object' && firstAnswer !== null) {
            // Sort by any available date fields (checking for submittedAt, createdAt, or updatedAt)
            if (firstAnswer.submittedAt || firstAnswer.createdAt || firstAnswer.updatedAt) {
              form.answers = form.answers.sort((a, b) => {
                // Get dates, checking all possible date fields
                const dateA = a.submittedAt || a.updatedAt || a.createdAt;
                const dateB = b.submittedAt || b.updatedAt || b.createdAt;
                
                if (dateA && dateB) {
                  return new Date(dateB) - new Date(dateA); // Descending order
                }
                return 0; // Keep original order if dates can't be compared
              });
            }
            // For other object structures, we could add more sorting options here
          }
          // For simple array of primitives, we don't sort
        }
      } catch (error) {
        console.error(`Error processing answers for form ${form._id}:`, error);
        // On error, keep original form unchanged
      }
      return form;
    });

    // Group machine forms by machine name
    const groupedMachines = {};
    processedForms.forEach(form => {
      if (!groupedMachines[form.machine]) {
        groupedMachines[form.machine] = [];
      }
      
      // Include all relevant data in grouped structure
      groupedMachines[form.machine].push({
        _id: form._id,
        flag: form.flag,
        value: form.value,
        answers: form.answers, // Now safely sorted if applicable
        createdAt: form.createdAt,
        updatedAt: form.updatedAt
      });
    });

    // Construct response
    res.status(200).json({
      success: true,
      count: processedForms.length,
      productTitle: processedForms[0].productTitle || 'Unknown Product',
      data: processedForms,
      groupedData: groupedMachines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Save a machine form (always create a new one)
const saveMachineForm = async (req, res) => {
  try {
    const { product, machine, flag, value } = req.body;

    // Validate required fields
    if (!product || !machine || !flag || !value) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: product, machine, flag, value",
        error: "Missing required fields"
      });
    }

    // Create new form with the given fields - always create a new entry
    const newMachineForm = new MachineForm({
      product,
      machine,
      flag,
      value
    });

    const savedForm = await newMachineForm.save();

    res.status(201).json({
      success: true,
      data: savedForm,
      message: "New machine form created"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Delete a specific machine form by ID
const deleteMachineFormById = async (req, res) => {
  try {
    const formId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid form ID format'
      });
    }

    const result = await MachineForm.findByIdAndDelete(formId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Machine form not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Machine form deleted successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Delete all machine forms for a product (keeping for backwards compatibility)
const deleteMachineFormsByProduct = async (req, res) => {
  try {
    const productId = req.params.product;

    const result = await MachineForm.deleteMany({ product: productId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No machine forms found for this product'
      });
    }

    res.status(200).json({
      success: true,
      count: result.deletedCount,
      message: `${result.deletedCount} machine forms deleted successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};
const addAnswerToMachineFormById = async (req, res) => {
  try {
    const formId = req.params.id;
    const { userId, answer } = req.body;

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(formId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid form ID or user ID format",
      });
    }

    if (!answer) {
      return res.status(400).json({
        success: false,
        message: "Answer is required",
      });
    }

    // Find and update the form
    const updatedForm = await MachineForm.findByIdAndUpdate(
      formId,
      {
        $push: {
          answers: {
            userId,
            answer,
            submittedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({
        success: false,
        message: "Machine form not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Answer added successfully",
      data: updatedForm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

export {
  addAnswerToMachineFormById,
  findAll,
  fetchMachineFormsByProduct,
  saveMachineForm,
  deleteMachineFormById,
  deleteMachineFormsByProduct,
};