// checkout.controller.js
import { Order } from '../models/checkout.model.js';
import { CheckoutUser } from '../models/checkoutUser.model.js';

/**
 * Creates a new order in the database with support for multiple products
 * @param {Object} orderData - The order data
 * @param {Array} orderData.items - Array of product items
 * @param {number} [orderData.totalAmount] - Total order amount (calculated if not provided)
 * @returns {Promise<Object>} - The created order document
 */
const createOrder = async (orderData) => {
  try {
    // Validate required fields
    const { items } = orderData;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Order must contain at least one product item');
    }

    // Validate each item has required fields
    items.forEach((item, index) => {
      if (!item.product || !item.quantity || !item.amount) {
        throw new Error(`Item at index ${index} is missing required fields: product, quantity, and amount are required`);
      }
    });

    // Calculate total amount if not provided
    if (!orderData.totalAmount) {
      orderData.totalAmount = items.reduce((total, item) => total + item.amount, 0);
    }

    // Create a new order
    const newOrder = new Order(orderData);

    // Save the order to the database
    const savedOrder = await newOrder.save();

    return savedOrder;
  } catch (error) {
    throw error;
  }
};

/**
 * Express route handler for creating a new order with multiple products
 */
const handleCreateOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one product item'
      });
    }

    // Validate each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const { product, quantity, amount, title, accessPeriod } = item;

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Item at index ${i} is missing product identifier`
        });
      }

      if (typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: `Item at index ${i} has invalid quantity. Quantity must be a positive number`
        });
      }

      if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: `Item at index ${i} has invalid amount. Amount must be a positive number`
        });
      }
    }

    // Create order data object
    const orderData = {
      items,
      ...(totalAmount && { totalAmount })
    };

    // Create the order
    const newOrder = await createOrder(orderData);

    // Return success response with created order
    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });

  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate order'
      });
    }

    // Handle unexpected errors
    return res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};


/**
 * Updates the order status based on payment success or failure
 * @param {string} id - The ID of the order to update
 * @param {boolean} isSuccess - Whether the payment was successful
 * @returns {Promise<Object>} - The updated order document
 */
const updateOrderStatus = async (id, isSuccess) => {
  try {
    // Determine the new status based on the isSuccess parameter
    const newStatus = isSuccess ? 'success' : 'failed';

    // Find the order by ID and update its status
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true } // Return the updated document
    );

    // Check if order exists
    if (!updatedOrder) {
      throw new Error('Order not found');
    }

    return updatedOrder;
  } catch (error) {
    // Properly handle and throw the error for middleware or calling function
    throw error;
  }
};

/**
 * Express route handler for updating order status
 */
const handleOrderStatusUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { isSuccess } = req.body;

    // Validate input
    if (isSuccess === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing isSuccess parameter'
      });
    }

    // Update the order status
    const updatedOrder = await updateOrderStatus(id, isSuccess);

    // Return success response
    return res.status(200).json({
      success: true,
      message: `Order status updated to ${updatedOrder.status}`,
      data: updatedOrder
    });

  } catch (error) {
    // Handle specific errors
    if (error.message === 'Order not found') {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Handle unexpected errors
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

const createCheckoutUser = async (req, res) => {
  try {
    const { name, email, order } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Check if user already exists
    let checkoutUser = await CheckoutUser.findOne({ email: email.toLowerCase() });

    if (checkoutUser) {
      // User exists, add order to existing user if provided
      if (order) {
        checkoutUser = await CheckoutUser.findByIdAndUpdate(
          checkoutUser._id,
          { $push: { order } },
          { new: true }
        );
      }
    } else {
      // Create new user with or without order
      const userData = {
        name,
        email,
        ...(order && { order: [order] })
      };

      checkoutUser = await CheckoutUser.create(userData);
    }

    return res.status(201).json({
      success: true,
      message: 'Checkout user processed successfully',
      data: checkoutUser
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to process checkout user',
      error: error.message
    });
  }
};

/**
 * Express route handler to add a product item to an existing order
 */
const addProductToOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { product, quantity, amount, accessPeriod } = req.body;

    // Validate required fields
    if (!product || !quantity || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: product, quantity, and amount are required'
      });
    }

    // Additional validation
    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive number'
      });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }

    // Find the order
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Create new item
    const newItem = {
      product,
      quantity,
      amount,
      ...(accessPeriod && { accessPeriod })
    };

    // Add the item to the order
    order.items.push(newItem);

    // Recalculate totalAmount
    order.totalAmount = order.items.reduce((total, item) => total + item.amount, 0);

    // Save the updated order
    const updatedOrder = await order.save();

    return res.status(200).json({
      success: true,
      message: 'Product added to order successfully',
      data: updatedOrder
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to add product to order',
      error: error.message
    });
  }
};

/**
 * Express route handler to remove a product item from an order
 */
const removeProductFromOrder = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;

    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Find the item index
    const itemIndex = order.items.findIndex(item => item._id.toString() === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in order'
      });
    }

    // Remove the item
    order.items.splice(itemIndex, 1);

    // Check if order still has items
    if (order.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove the last item from an order. Delete the entire order instead.'
      });
    }

    // Recalculate totalAmount
    order.totalAmount = order.items.reduce((total, item) => total + item.amount, 0);

    // Save the updated order
    const updatedOrder = await order.save();

    return res.status(200).json({
      success: true,
      message: 'Product removed from order successfully',
      data: updatedOrder
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to remove product from order',
      error: error.message
    });
  }
};

/**
 * Get all successfully purchased items for a specific user
 */
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user ID
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Find the user
    const user = await CheckoutUser.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get the order IDs associated with this user
    const orderIds = user.order || [];

    // Find all successful orders for this user
    const orders = await Order.find({
      _id: { $in: orderIds },
      status: 'success'
    });

    // Extract just the items from all orders
    const allPurchasedItems = [];
    orders.forEach(order => {
      order.items.forEach(item => {
        allPurchasedItems.push({
          product: item.product,
          quantity: item.quantity,
          accessPeriod: item.accessPeriod,
          purchaseDate: order.createdAt
        });
      });
    });

    return res.status(200).json({
      success: true,
      userId: userId,
      userName: user.name,
      userEmail: user.email,
      purchasedItemsCount: allPurchasedItems.length,
      purchasedItems: allPurchasedItems
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user purchased items',
      error: error.message
    });
  }
};

/**
 * Get all users with their successfully purchased items
 */
const getAllUsersWithPurchases = async (req, res) => {
  try {
    // Find all users
    const users = await CheckoutUser.find({});
    // Initialize array to hold user purchase data
    const usersWithPurchases = [];

    // For each user, find their successful orders
    for (const user of users) {
      const orderIds = user.order || [];

      if (orderIds.length > 0) {
        // Find successful orders for this user
        const successfulOrders = await Order.find({
          _id: { $in: orderIds },
          status: 'success'
        });
        console.log('Successful orders for user:', successfulOrders);
        // Only include users who have at least one successful order
        if (successfulOrders.length > 0) {
          // Extract just the items from all orders
          const purchasedItems = [];

          successfulOrders.forEach(order => {
            order.items.forEach(item => {
              purchasedItems.push({
                product: item.product,
                quantity: item.quantity,
                accessPeriod: item.accessPeriod,
                purchaseDate: order.createdAt
              });
            });
          });

          // Add user data to result array only if they have purchased items
          if (purchasedItems.length > 0) {
            usersWithPurchases.push({
              _id: user._id,
              name: user.name,
              email: user.email,
              purchasedItemsCount: purchasedItems.length,
              purchasedItems: purchasedItems,
              totalAmount: successfulOrders.reduce((total, order) => total + order.totalAmount, 0)

            });
          }
        }
      }
    }

    // Sort users by number of purchased items (highest first)
    usersWithPurchases.sort((a, b) => b.purchasedItemsCount - a.purchasedItemsCount);

    return res.status(200).json({
      success: true,
      userCount: usersWithPurchases.length,
      data: usersWithPurchases
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users with purchases',
      error: error.message
    });
  }
};
const getUserByIdWithPurchases = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Find the specific user
    const user = await CheckoutUser.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const orderIds = user.order || [];
    let userWithPurchases = null;

    if (orderIds.length > 0) {
      // Find successful orders for this user
      const successfulOrders = await Order.find({
        _id: { $in: orderIds },
        status: 'success'
      });

      // Extract the items from all orders
      const purchasedItems = [];

      successfulOrders.forEach(order => {
        order.items.forEach(item => {
          purchasedItems.push({
            product: item.product,
            quantity: item.quantity,
            accessPeriod: item.accessPeriod,
            purchaseDate: order.createdAt,
            title: item.title
          });
        });
      });

      // Create user data object with purchase information
      userWithPurchases = {
        id: user._id,
        name: user.name,
        email: user.email,
        purchasedItemsCount: purchasedItems.length,
        purchasedItems: purchasedItems,
        totalAmount: successfulOrders.reduce((total, order) => total + order.totalAmount, 0),
        region: user?.region
      };
    } else {
      // User exists but has no orders
      userWithPurchases = {
        id: user._id,
        name: user.name,
        email: user.email,
        purchasedItemsCount: 0,
        purchasedItems: [],
        totalAmount: 0
      };
    }

    return res.status(200).json({
      success: true,
      data: userWithPurchases
    });

  } catch (error) {
   
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user with purchases',
      error: error.message
    });
  }
};


export {
  handleCreateOrder,
  handleOrderStatusUpdate,
  createCheckoutUser,
  addProductToOrder,
  removeProductFromOrder,
  getUserOrders,
  getAllUsersWithPurchases,
  getUserByIdWithPurchases
};