import { NextApiRequest, NextApiResponse } from 'next';
import jwt from "jsonwebtoken";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized', authenticated: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!); // Verifies the signature
        // req.user = decoded; // Optional: Attach token info to the request object
        return res.status(200).json({ authenticated: true })
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token', authenticated: false });
    }
}