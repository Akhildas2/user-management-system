import { Request, Response } from 'express';
import User from '../config/models/userModels';
import crypto from 'crypto';
import { uploadToCloudinary } from '../helpers/uploadToCloudinary';
import { deleteFromCloudinary } from '../helpers/deleteFromCloudinary';


// Get All Users
export const getUserList = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find({ isAdmin: false });

        if (!users.length) {
            res.status(404).json({ status: 'error', message: 'No users found' });
            return;
        }
        res.status(200).json({ status: 'success', data: users });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error fetching users', error });
    }
};


// Get User by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ status: 'error', message: 'User not found' });
            return;
        }

        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error fetching user', error });
    }
};


// Create New User
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, phone, email, dob, gender, skills, position } = req.body;

        if (!name || !email || !phone) {
            res.status(400).json({ status: 'error', message: 'Name, Email, and Phone are required.' });
            return;
        }

        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            res.status(400).json({ status: 'error', message: 'Email or phone number already in use.' });
            return;
        }

        const randomPassword = crypto.randomBytes(8).toString('hex');
        let profileImage = "";

        if (req.file) {
            const uploadResponse = await uploadToCloudinary(req.file.buffer);
            profileImage = uploadResponse.secure_url;
        }

        const newUser = await User.create({
            name,
            email,
            phone,
            password: randomPassword,
            profileImage,
            dob,
            gender,
            skills,
            position,
        });


        res.status(201).json({ status: 'success', data: newUser });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error creating user', error });
    }
};


// Update User
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, phone, email, dob, gender, skills, position, _id } = req.body;

        console.log("req.body",req.body);
        
        if (!_id) {
            res.status(400).json({ status: 'error', message: 'User ID is required.' });
            return;
        }

        const existingUser = await User.findOne({ $or: [{ email }, { phone }], _id: { $ne: _id } });
        if (existingUser) {
            res.status(400).json({ status: 'error', message: 'Email or phone number already in use.' });
            return;
        }
        const user = await User.findById(_id);
        if (!user) {
            res.status(404).json({ status: "error", message: "User not found." });
            return;
        }

        let profileImage = user.profileImage;
        if (req.file) {
            if (user.profileImage) {
                await deleteFromCloudinary(user.profileImage);
            }
            const uploadResponse = await uploadToCloudinary(req.file.buffer);
            profileImage = uploadResponse.secure_url;
        }

        user.set({ name, email, phone, profileImage, dob, gender, skills, position });
        const updatedUser = await user.save();


        res.status(200).json({ status: 'success', message: 'User updated successfully.', data: updatedUser });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to update user', error });
    }
};

// Delete User
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ status: 'error', message: 'User ID is required.' });
            return;
        }

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            res.status(404).json({ status: 'error', message: 'User not found.' });
            return;
        }

        res.status(200).json({ status: 'success', message: 'User deleted successfully.' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to delete user', error });
    }
};

// Toggle Blocked user
export const toggleBlockUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ status: "error", message: "User not found." });
            return;
        }
        user.isBlocked = !user.isBlocked;

        await user.save();

        res.status(200).json({
            status: 'success',
            message: user.isBlocked ? 'User has been blocked.' : 'User has been unblocked.',
            isBlocked: user.isBlocked
        });


    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to block/unblock user', error });
    }
}