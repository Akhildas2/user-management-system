import { Request, Response } from 'express';
import User from '../models/userModels';

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
        console.error(error);
        // Handle errors message
        res.status(500).json({ msg: 'Internal Server Error!' });
    }
};


// For getting the users
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, contactNumber, age, gender, skill } = req.body
        const newForm = new User({
            firstName,
            lastName,
            email,
            contactNumber,
            age,
            gender,
            skill
        })
        await newForm.save();
        console.log(req.body);

        res.status(200).json({ msg: "New User Register Successfully!" })
    } catch (error) {
        console.error(error);
        // Handle errors message
        res.status(500).json({ msg: 'Internal Server Error!' });
    }
}