// controllers/auth.controller.js
import { CheckoutUser } from '../models/checkoutUser.model.js';
import { generateToken, createExpirationDate, isExpired } from '../utils/token.util.js';
import { sendVerificationEmail, testEmailConnection } from '../services/email.service.js';

/**
 * Handles sign-in requests by email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const signInByEmail = async (req, res) => {
  try {
    const { email, name } = req.body;
    console.log(req.body)
    // Validate required fields
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email and name are required'
      });
    }

    // Test email connection first
    try {
      await testEmailConnection();
    } catch (emailError) {
      console.error('Email configuration error:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Email service is not properly configured',
        error: emailError.message
      });
    }

    // Check if user exists
    console.log('Looking for user with email:', email.toLowerCase());
    let user = await CheckoutUser.findOne({
      email: email.toLowerCase(),
      name: { $regex: new RegExp(`^${name}$`, 'i') } // Case-insensitive name match
    });

    // If user doesn't exist, create a new one
    if (!user) {
      console.log('User not found');
      // user = await CheckoutUser.create({
      //   email: email.toLowerCase(),
      //   name
      // });
      // console.log('New user created with ID:', user._id);
      return res.status(200).json({
        success: false,
        message: 'User not found. Please checkout first.'
      })
    } else {
      console.log('Existing user found with ID:', user._id);
    }

    // Generate auth token
    const token = generateToken();
    const expiresAt = createExpirationDate(24); // 24 hours expiration

    // Save token to user
    user.authToken = {
      token,
      expiresAt
    };
    await user.save();
    console.log('Auth token saved to user');

    // Generate verification link
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const verificationLink = `${baseUrl}/dashboard/home?token=${token}&userId=${user._id}`;

    try {
      await sendVerificationEmail(user.email, user.name, verificationLink);
      console.log('Email sent successfully');
    } catch (emailError) {
      console.error('Failed to send email:', emailError);

      // Even if email fails, we can return the verification link in development
      if (process.env.NODE_ENV === 'development') {
        return res.status(200).json({
          success: true,
          message: 'Warning: Email could not be sent, but verification link is provided below.',
          error: emailError.message,
          verificationLink
        });
      } else {
        return res.status(500).json({
          success: false,
          message: 'Failed to send verification email',
          error: emailError.message
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Verification email sent. Please check your inbox.',
      // For development, include the link in the response
      ...(process.env.NODE_ENV === 'development' && { verificationLink })
    });

  } catch (error) {
    console.error('Sign-in error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process sign-in request',
      error: error.message
    });
  }
};

/**
 * Verifies a token when user clicks the email link
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const verifyToken = async (req, res) => {
  try {
    console.log('Token verification request received:', req.query);

    const { token, userId } = req.query;

    // Validate required parameters
    if (!token || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification link'
      });
    }

    // Find user by ID
    console.log('Looking for user with ID:', userId);
    const user = await CheckoutUser.findById(userId);

    // Check if user exists and has a valid token
    if (!user) {
      console.log('User not found');
      return res.status(400).json({
        success: false,
        message: 'Invalid verification link: User not found'
      });
    }

    if (!user.authToken || user.authToken.token !== token) {
      console.log('Token mismatch or missing');
      return res.status(400).json({
        success: false,
        message: 'Invalid verification link: Token mismatch'
      });
    }

    // Check if token is expired
    if (isExpired(user.authToken.expiresAt)) {
      console.log('Token expired at:', user.authToken.expiresAt);
      return res.status(400).json({
        success: false,
        message: 'Verification link has expired. Please request a new one.'
      });
    }

    console.log('Token verified successfully');

    // Clear auth token
    user.authToken = undefined;
    await user.save();
    console.log('Auth token cleared from user');

    // Return success with user info
    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify authentication',
      error: error.message
    });
  }
};

export {
  signInByEmail,
  verifyToken,
};