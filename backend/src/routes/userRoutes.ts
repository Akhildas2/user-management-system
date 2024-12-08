import express from 'express';
import bodyParser from 'body-parser';
import * as userControllers from '../controllers/userControllers';
import * as authControllers from '../controllers/authControllers';
import { authenticateToken } from '../middlewares/authMiddleware';

const jsonParser = bodyParser.json();
const router = express.Router();

// GET API - READ: Fetch all users
router.get('/user/:id', authenticateToken, userControllers.getUsers);

// PUT API - UPDATE: Update an existing user by ID
router.put('/user', authenticateToken, jsonParser, userControllers.updateUser);

// DELETE API - DELETE: Delete a user by ID
router.delete('/user/:id', authenticateToken, userControllers.deleteUser);

// Create User
router.post('/register', jsonParser, authControllers.register)

// Get User
router.post('/login', authControllers.login)

// Logut user
router.post('/logout', authControllers.logout)

// For Refresh Token
router.post('/refresh-token', authControllers.refreshAccessToken);

export default router;
