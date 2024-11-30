import mongoose from 'mongoose';


const connectDB = async (): Promise<void> => {
    try {
        // Ensure MONGO_URI is defined
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error('MONGO_URI is not defined in the environment variables.');
        }

        // Connect to MongoDB
        const con = await mongoose.connect(mongoURI);
        console.log(`Server connected to MongoDB at host: ${con.connection.host}`);
    } catch (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit the process if the connection fails
    }
};

export default connectDB;
