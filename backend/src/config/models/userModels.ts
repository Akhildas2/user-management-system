import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from "bcrypt";

// Define an interface for the User document
interface IUser extends Document {
    name: string;
    email: string;
    phone: number;
    password: string;
    photo: string;
    age: number;
    gender: string;
    position: string;
    skill: string;
    isAdmin: boolean;
    comparePassword(password: string): Promise<boolean>;
    createdAt: Date;
}

// Create a Schema corresponding to the IUser interface
const UserSchema: Schema = new Schema<IUser>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true, minlength: 8 },
    photo: { type: String },
    age: { type: Number },
    gender: { type: String },
    position: { type: String },
    skill: { type: String },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});



// Hash passwordd before saving 
UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Method to compare password
UserSchema.methods.comparePassword = function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
}

// Create and export the User model
const User = mongoose.model<IUser>('User', UserSchema);
export default User;
