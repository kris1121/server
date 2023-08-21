import jwt from "jsonwebtoken";
import dotenv from "dotenv"

import User from "../models/user.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";

dotenv.config();

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //validation
        if (!name.trim()) return res.json({ error: "Name is required!" });
        if (!email.trim()) return res.json({ error: "Email is required!" });
        if (!password || password.length < 6) return res.json({
            error: "Password must be at least 6 characters"
        });

        //check if email is taken
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.json({ error: "Email is taken" });

        //hash password
        const hashedPassword = await hashPassword(password);

        //register user
        const user = await new User({ name, email, password: hashedPassword }).save();

        //create sign jwt
        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        //send response
        res.json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address
            },
            token
        })
    } catch (error) {
        console.log(error)
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //validation
        if (!email.trim()) return res.json({ error: "Email is required!" });
        if (!password || password.length < 6) return res.json({
            error: "Password must be at least 6 characters"
        });

        //check if email is taken
        const user = await User.findOne({ email });
        if (!user) return res.json({ error: "User not found!" });

        //compare password
        const match = comparePassword(password, user.password);
        if (!match) return res.json({ error: "Wrong password!" });

        //create sign jwt
        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        //send response
        res.json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address
            },
            token
        })
    } catch (error) {
        console.log(error)
    }
}

export const secret = async (req, res) => {
    res.json({ message: "You have access to this secret route", currentUser: req.user });
}
