import { Request, Response } from 'express';
import User from '../config/models/userModels';

// For getting the user
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        // Find user from the database
        const result = await User.findOne({ _id: id });
        if (result) {
            // If user are found, return them in the response
            res.status(200).json(result);
        } else {
            // If no user are found
            res.status(404).json({ msg: 'Records Not Found!' });
        }

    } catch (error) {
        // Handle errors message
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error!' });
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
            res.status(404).json({ msg: "User not found!" });
            return;
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
