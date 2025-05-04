// routes/authRoutes.js
import express from 'express';
import {
    signInByEmail,
    verifyToken,
} from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * @route   POST /auth/signin
 * @desc    Sign in with email (sends verification link)
 * @access  Public
 */
router.post('/signin', signInByEmail);
/**
 * @route   GET /auth/verify
 * @desc    Verify the token from email link
 * @access  Public
 */
router.get('/verify', verifyToken);

export { router };