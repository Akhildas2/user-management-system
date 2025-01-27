import express from 'express';
import dotenv from 'dotenv'; // For environment variables
import cookieParser from 'cookie-parser'; // For parsing cookies
import cors from 'cors'; // For enabling CORS
import connectDB from './config/DB/dbConnection'; // Database connection logic
import usersRoutes from './routes/userRoutes'; // Importing user-related routes
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

const app = express();
const PORT: number = parseInt(process.env.PORT || '3333', 10);

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Enable CORS with custom configuration
app.use(
    cors({
        origin: process.env.CLIENT_URL, // Allow only the URL specified in the .env file
        methods: 'GET,POST,PUT,DELETE,OPTIONS', // Specify allowed HTTP methods
        credentials: true, // Allow cookies and credentials
    })
);


// User routes (all routes prefixed with /api)
app.use('/api', usersRoutes);

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
