import express from 'express';
import dotenv from 'dotenv';// Import dotenv
import cookieParser from 'cookie-parser';// Import cookie-parser
import connectDB from './config/DB/dbConnection';  // Import the database connection
import usersRoutes from './routes/userRoutes'; // Import routes

// Load environment variables from .env file
dotenv.config();
connectDB() // For DB connection

const app = express();
const PORT: number = parseInt(process.env.PORT || '3333', 10);

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());

// User routes
app.use('/api', usersRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
