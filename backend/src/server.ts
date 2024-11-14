import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from './config/dbConnection';  // Import the database connection

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || '3333', 10);

// Middleware to parse JSON
app.use(express.json());

// Import routes
import users from './routes/users';

// Route handler
app.get('/', (req: Request, res: Response) => {
    res.send('API is working');
});

// User routes
app.use('/api', users);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
