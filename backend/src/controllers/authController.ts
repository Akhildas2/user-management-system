import { Request, Response } from "express";
import * as authService from "../services/authService";

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required.' });
            return;
        }
        const result = await authService.login(email, password);
        if (!result) {
            res.status(401).json({ message: 'Invalid credentials.' });
            return;
        }
        console.log(result);

        res.json({ message: 'Login successful', token: result.token, user: result.user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error!' });
    }
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) {
            res.status(400).json({ message: 'All fields are required.' });
            return;
        }

        const newUser = await authService.register(name, email, phone, password);
        if (!newUser) {
            res.status(409).json({ message: 'User already exists.' });
            return;
        }
        res.status(201).json({ message: 'User created successfully', token: newUser.token, user: newUser.user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error!' });
    }
};
