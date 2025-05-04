// controllers/faqs.controller.js
import { Faqs } from '../models/faqs.model.js';
import mongoose from 'mongoose';

// Get all FAQs with product titles
const findAll = async (req, res) => {
  try {
    const faqs = await Faqs.aggregate([
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
          faqs: 1,
          createdAt: 1,
          updatedAt: 1,
          productTitle: '$productDetails.title'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Get FAQs for a specific product
const fetchFaqsByProduct = async (req, res) => {
  try {
    const productId = req.params.product;

    const faqs = await Faqs.aggregate([
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
          faqs: 1,
          createdAt: 1,
          updatedAt: 1,
          productTitle: '$productDetails.title'
        }
      }
    ]);

    // If no data exists, return an empty structure
    if (faqs.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: {
          product: productId,
          faqs: []
        }
      });
    }

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Save FAQs (create or update)
const saveFaqs = async (req, res) => {
  try {
    const { product, faqs } = req.body;

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product is required",
        error: "Missing product field"
      });
    }

    // Check if FAQs for this product already exists
    let faqDocument = await Faqs.findOne({ product });
    let isNewRecord = false;

    if (!faqDocument) {
      // Create new FAQs if not exists
      faqDocument = new Faqs({
        product,
        faqs: faqs || []
      });
      isNewRecord = true;
    } else {
      // Update existing FAQs
      faqDocument.faqs = faqs || [];
    }

    // Save the document
    await faqDocument.save();

    // Simplified response without the complex aggregation
    res.status(isNewRecord ? 201 : 200).json({
      success: true,
      data: faqDocument,
      message: isNewRecord
        ? "FAQs created successfully"
        : "FAQs updated successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};


//new api for create 
const createFaqs = async (req, res) => {
  try {
    const { product, faqs } = req.body;

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product is required",
        error: "Missing product field"
      });
    }

    // Check if FAQs for this product already exist
    const existingFaqs = await Faqs.findOne({ product });

    if (existingFaqs) {
      return res.status(409).json({
        success: false,
        message: "Cannot create FAQs. Product already has FAQs. You can edit it instead.",
        error: "FAQs already exist"
      });
    }

    // Create new FAQs
    const faqDocument = new Faqs({
      product,
      faqs: faqs || []
    });

    // Save the document
    await faqDocument.save();

    res.status(201).json({
      success: true,
      data: faqDocument,
      message: "FAQs created successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};


// Update existing FAQs only (returns error if doesn't exist)
// Try this modification in your controller's updateFaqs function
const updateFaqs = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL parameter
    const { faqs } = req.body;

    console.log("ID:", id);
    console.log("Request body:", req.body);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "FAQ ID is required",
        error: "Missing id parameter"
      });
    }

    // Check if FAQs with this ID exist
    const faqDocument = await Faqs.findById(id);
    console.log("Found document:", faqDocument);

    if (!faqDocument) {
      return res.status(404).json({
        success: false,
        message: "Cannot update FAQs. FAQ document with this ID doesn't exist. Create FAQs first.",
        error: "FAQs not found"
      });
    }

    // Update existing FAQs
    faqDocument.faqs = faqs || [];

    // Save the document
    await faqDocument.save();
    console.log("Updated document:", faqDocument);

    res.status(200).json({
      success: true,
      data: faqDocument,
      message: "FAQs updated successfully"
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};


// Delete FAQs for a product
const deleteFaqs = async (req, res) => {
  try {
    const productId = req.params.product;

    const result = await Faqs.deleteOne({ product: productId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No FAQs found for this product'
      });
    }

    res.status(200).json({
      success: true,
      message: 'FAQs deleted successfully'
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
  fetchFaqsByProduct,
  saveFaqs,
  createFaqs,
  deleteFaqs,
  updateFaqs
};