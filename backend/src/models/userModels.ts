import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the User document
interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: number;
    age: number;
    gender: string;
    skill: string;
    createdAt: Date;
}

// Create a Schema corresponding to the IUser interface
const userSchema: Schema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: Number, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    skill: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create and export the User model
const User = mongoose.model<IUser>('User', userSchema);
export default User;
