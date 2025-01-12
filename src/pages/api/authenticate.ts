import { NextApiRequest, NextApiResponse } from 'next';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const pass64 = process.env.FAMILY_PASSWORD;
        if (!pass64) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        const correctPassword = atob(pass64);
        const { password } = req.body;
        if (password === correctPassword) {
            // Generate a JWT on successful login
            const token = jwt.sign(
                { authenticated: true }, // Payload
                process.env.JWT_SECRET!, // Secret key
                { expiresIn: '1h' } // Token expiration
            );

            res.setHeader(
                'Set-Cookie',
                cookie.serialize('authToken', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60,
                    sameSite: 'strict',
                    path: '/',
                })
            );

            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({ message: 'Incorrect password' });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
