import { Request, Response } from 'express';
import User from '../config/models/userModels';
import crypto from 'crypto';

// Get All Users
export const getUserList = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find();
        
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
        const { name, email, phone } = req.body;

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
        const newUser = await User.create({ name, email, phone, password: randomPassword });

        res.status(201).json({ status: 'success', data: newUser });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error creating user', error });
    }
};

// Update User
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, name, phone, email, dob, gender, skills, position } = req.body;

        if (!id) {
            res.status(400).json({ status: 'error', message: 'User ID is required.' });
            return;
        }

        const existingUser = await User.findOne({ $or: [{ email }, { phone }], _id: { $ne: id } });
        if (existingUser) {
            res.status(400).json({ status: 'error', message: 'Email or phone number already in use.' });
            return;
        }

        const user = await User.findByIdAndUpdate(
            id,
            { $set: { name, phone, dob, gender, skills, position } },
            { new: true }
        );

        if (!user) {
            res.status(404).json({ status: 'error', message: 'User not found.' });
            return;
        }

        res.status(200).json({ status: 'success', message: 'User updated successfully.', data: user });
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
