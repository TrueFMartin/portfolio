import { NextApiRequest, NextApiResponse } from 'next';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        // Check if the username already exists
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });
        if (existingUser) {
            return res.status(409).json({ error: "Username is already taken" });
        }

        // Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the user in the database
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        // Return the created user (excluding the password)
        return res.status(201).json({ id: user.id, username: user.username });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "An error occurred while creating the user" });
    }
}
