// routes/checkout.route.js
import express from 'express';
import {
  handleOrderStatusUpdate,
  handleCreateOrder,
  createCheckoutUser,
  addProductToOrder,
  removeProductFromOrder,
  getUserOrders,
  getAllUsersWithPurchases,
  getUserByIdWithPurchases
} from '../controllers/checkout.controller.js';
import { CheckoutUser } from '../models/checkoutUser.model.js';

const router = express.Router();

// Create a new Order
router.post('/', handleCreateOrder);

// Update order status
router.patch('/:id/status', handleOrderStatusUpdate);

// Create a new checkout user
router.post('/user', createCheckoutUser);

// Add a product to an existing order
router.post('/:id/products', addProductToOrder);

// Remove a product from an order
router.delete('/:orderId/products/:itemId', removeProductFromOrder);

// Get all successful orders for a specific user
router.get('/users/:userId/orders', getUserOrders);

// Get all users with their successful purchases
router.get('/users/purchases', getAllUsersWithPurchases);

router.patch("/checkout-user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Build update object dynamically
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    const updatedUser = await CheckoutUser.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get('/users/purchases/:userId', getUserByIdWithPurchases);


export { router };