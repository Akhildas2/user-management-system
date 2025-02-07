import { Request, Response } from 'express';
import User from '../config/models/userModels';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import cloudinary from '../config/cloudinaryConfig';
import { uploadToCloudinary } from '../helpers/uploadToCloudinary';
import { deleteFromCloudinary } from '../helpers/deleteFromCloudinary';

// For getting the user
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ status: 'error', msg: 'Invalid User ID' });
            return;
        }

        // Find user from the database
        const result = await User.findOne({ _id: id });
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ status: 'error', msg: 'User Not Found!' });
        }

    } catch (error) {
        // Handle errors message
        res.status(500).json({ status: 'error', msg: 'Internal Server Error!' });
    }
};

// For updating user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, name, phone, dob, gender, skills, position } = req.body;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ status: 'error', msg: 'Invalid User ID' });
            return;
        }

        // Check if the phone number is already in use by another user
        const existingUser = await User.findOne({ phone, _id: { $ne: id } })

        if (existingUser) {
            res.status(400).json({ status: 'error', msg: 'Phone number already in used.' });
            return;
        }

        const user = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    name, phone, dob, gender, skills, position
                }
            },
            { new: true }
        );

        if (!user) {
            res.status(404).json({ status: 'error', msg: "User not found!" });
            return;
        }

        res.status(200).json({ status: 'success', msg: "User Updated Successfully!", user });
    } catch (error) {
        // Handle errors message
        res.status(500).json({ status: 'error', msg: 'Failed to update user' });
    }
};

// For deleting user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ status: 'error', msg: 'Invalid User ID' });
            return;
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (deletedUser) {
            res.status(200).json({ status: 'success', msg: 'User deleted successfully' });
        } else {
            res.status(404).json({ status: 'error', msg: 'User not found' });
        }

    } catch (error) {
        // Handle errors message
        res.status(500).json({ status: 'error', msg: 'Failed to delete user' });
    }
};

// For user photo upload
export const photoUpload = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.body;

        if (!req.file || !id) {
            res.status(400).json({
                status: 'error',
                msg: !id ? 'User ID is required' : 'No file uploaded',
            });
            return;
        }

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ status: 'error', msg: 'Invalid User ID' });
            return;
        }

        // Ensure the user exists
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ status: 'error', msg: 'User not found' });
            return;
        }

        // Delete old photo from Cloudinary if it exists
        if (user.profileImage) {
            await deleteFromCloudinary(user.profileImage);
        }

        const uploadResponse = await uploadToCloudinary(req.file.buffer);
        user.profileImage = uploadResponse.secure_url;
        const updatedUser = await user.save();

        res.status(200).json({ status: 'success', message: 'Photo uploaded successfully', user: updatedUser });

    } catch (error) {
        console.error("Error uploading photo:", error);
        res.status(500).json({ status: 'error', msg: 'Failed to upload photo', error });
    }
};
