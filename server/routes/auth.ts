import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { getCollection } from '../db';
import { ObjectId } from 'mongodb';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const RegisterSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional(),
});

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

// Register
router.post('/register', async (req: express.Request, res: express.Response) => {
    try {
        const validated = RegisterSchema.parse(req.body);
        const users = await getCollection('users');

        const existing = await users.findOne({ email: { $regex: `^${validated.email}$`, $options: 'i' } });
        if (existing) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(validated.password, 10);
        const now = new Date();
        const newUser = {
            name: validated.name,
            email: validated.email.toLowerCase(),
            password: hashedPassword,
            phone: validated.phone,
            role: 'user',
            approved: false,
            favorites: [],
            createdAt: now,
            updatedAt: now,
        };

        const result = await users.insertOne(newUser);
        res.status(201).json({
            success: true,
            message: 'Account created successfully. Please wait for admin approval.',
            token: '', // Placeholder if needed, or omit if login is separate after approval
            user: {
                _id: result.insertedId.toString(),
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                createdAt: newUser.createdAt.toISOString(),
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues[0].message });
        }
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = LoginSchema.parse(req.body);
        const users = await getCollection('users');

        const user = await users.findOne({ email: { $regex: `^${email}$`, $options: 'i' } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.suspendedAt) {
            return res.status(403).json({ error: 'Your account is on suspension.' });
        }

        if (user.approved === false) {
            return res.status(403).json({ error: 'Account pending approval.' });
        }

        const token = jwt.sign(
            { userId: user._id.toString(), email: user.email, role: user.role || 'user' },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            token,
            user: {
                _id: user._id.toString(),
                name: user.name || `${user.firstName} ${user.lastName}`.trim(),
                email: user.email,
                role: user.role || 'user',
                phone: user.phone,
                createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues[0].message });
        }
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

export default router;
