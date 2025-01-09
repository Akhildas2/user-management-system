import { Request, Response } from 'express';
import User from '../config/models/userModels';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

// For getting the user
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        // Find user from the database
        const result = await User.findOne({ _id: id });
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ status: 'error', msg: 'User Not Found!' });
        }

    } catch (error) {
        // Handle errors message
        console.error(error);
        res.status(500).json({ status: 'error', msg: 'Internal Server Error!' });
    }
};

// For updating user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, name, email, phone, dob, gender, skills, position } = req.body;

        const user = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    name, email, phone, dob, gender, skills, position
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
        console.error(error);
        // Handle errors message
        res.status(500).json({ status: 'error', msg: 'Failed to update user' });
    }
};

// For deleting user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (deletedUser) {
            res.status(200).json({ status: 'success', msg: 'User deleted successfully' });
        } else {
            res.status(404).json({ status: 'error', msg: 'User not found' });
        }

    } catch (error) {
        console.error(error);
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
                msg: !id ? 'User ID is required' : 'No file uploaded'
            });
            return;
        }

        const filename = req.file.filename;
        // Remove the leading slash from the relative path
        const relativePath = `uploads/${filename}`;

        // Ensure the user exists
        const user = await User.findById(id);
        if (!user) {
            fs.unlinkSync(path.join(__dirname, '..', 'uploads', filename));
            res.status(404).json({ status: 'error', msg: 'User not found' });
            return;
        }

        // Delete old profile image if it exists
        if (user.profileImage) {
            const oldImagePath = path.join(__dirname, '..', user.profileImage);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }
        // Update user's profile image
        user.profileImage = relativePath;
        const updatedUser = await user.save();
        console.log("updateUser:", updatedUser);

        res.status(200).json({
            status: 'success',
            message: 'Photo uploaded successfully',
            relativePath,
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error during photo upload:', error);
        res.status(500).json({ status: 'error', msg: 'Failed to upload photo', error });
    }
};