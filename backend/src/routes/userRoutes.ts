import express from 'express';
import bodyParser from 'body-parser';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userControllers';
import { login,register } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';

const jsonParser = bodyParser.json();
const router = express.Router();

// GET API - READ: Fetch all users
router.get('/user', getUsers);

// POST API - CREATE: Add a new user
router.post('/user', jsonParser, createUser);

// PUT API - UPDATE: Update an existing user by ID
router.put('/user', jsonParser, updateUser);

// DELETE API - DELETE: Delete a user by ID
router.delete('/user/:id', deleteUser);

// Create user
router.post('/register', jsonParser, register)

// Create user
router.post('/login', login)

export default router;
