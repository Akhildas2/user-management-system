import { Request, Response } from 'express';
import User from '../config/models/userModels';

// For getting the users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        // Find all users from the database
        const result = await User.find({});

        if (result && result.length > 0) {
            // If users are found, return them in the response
            res.status(200).json({ result });
        } else {
            // If no users are found
            res.status(404).json({ msg: 'Records Not Found!' });
        }

    } catch (error) {
        // Handle errors message
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error!' });
    }
};

// For creating users
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, contactNumber, age, gender, skill } = req.body;
        const newForm = new User({
            firstName,
            lastName,
            email,
            contactNumber,
            age,
            gender,
            skill
        });

        await newForm.save();

        // Use status 201 for successful creation
        res.status(201).json({ msg: "New User Registered Successfully!" });
    } catch (error) {
        // Handle errors message
        console.error(error);
        res.status(500).json({ msg: 'Failed to create user' });
    }
};

// For updating user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, firstName, lastName, email, contactNumber, age, gender, skill } = req.body;
        const user = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    firstName, lastName, email, contactNumber, age, gender, skill
                }
            },
            { new: true }
        );

        if (!user) {
            res.status(404).json({ msg: "User not found!" });
        }

        res.status(200).json({ msg: "User Updated Successfully!", user });
    } catch (error) {
        console.error(error);
        // Handle errors message
        res.status(500).json({ msg: 'Failed to update user' });
    }
};

// For deleting user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (deletedUser) {
            res.status(200).json({ msg: 'User deleted successfully' });
        } else {
            res.status(404).json({ msg: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        // Handle errors message
        res.status(500).json({ msg: 'Failed to delete user' });
    }
};
