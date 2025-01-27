import express from 'express';
import bodyParser from 'body-parser';
import * as userControllers from '../controllers/userControllers';
import * as adminControllers from '../controllers/adminControllers';
import * as authControllers from '../controllers/authControllers';
import { authenticateToken } from '../middlewares/authMiddleware';
import upload from '../middlewares/uploadMiddleware';

const jsonParser = bodyParser.json();
const router = express.Router();

// User routes
router.get('/user/:id', userControllers.getUsers); // Get user by ID
router.put('/user', jsonParser, userControllers.updateUser); // Update user
router.delete('/user/:id', userControllers.deleteUser); // Delete user
router.post('/user/upload-photo', upload.single('profileImage'), userControllers.photoUpload); // Upload photo

// Common routes
router.post('/register', jsonParser, authControllers.register); // Register
router.post('/login', authControllers.login); // Login
router.post('/logout', authControllers.logout); // Logout
router.post('/refresh-token', authControllers.refreshAccessToken); // Refresh token

// Admin routes
router.get('/admin', adminControllers.getUserList); // Get all users
router.get('/admin/:id', adminControllers.getUserById); // Get user by ID
router.post('/admin', adminControllers.createUser); // Create user
router.put('/admin/:id', adminControllers.updateUser); // Update user
router.delete('/admin/:id', adminControllers.deleteUser); // Delete user

export default router;
