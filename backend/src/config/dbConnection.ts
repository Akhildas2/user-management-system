import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config()
// Get the MongoDB connection string from environment variables
const MONGO_URI:string =process.env.MONGO_URI as string;
if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in the .env file');
}

// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_URI)
.then(() => {
    console.log('Database is connected');
})
.catch((error) => {
    console.error('Database connection error:', error);
});

export default mongoose;