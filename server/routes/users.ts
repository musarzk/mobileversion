import express from 'express';
import { getCollection } from '../db';
import { ObjectId } from 'mongodb';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get User Profile
router.get('/me', authenticate, async (req: AuthRequest, res) => {
    try {
        const users = await getCollection('users');
        const user = await users.findOne({ _id: new ObjectId(req.user!.userId) });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const { password, ...safeUser } = user;
        res.json({ user: safeUser });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update Profile
router.patch('/profile', authenticate, async (req: AuthRequest, res) => {
    try {
        const users = await getCollection('users');
        const allowed = ['firstName', 'lastName', 'phone', 'location', 'bio', 'avatar'];
        const update: any = { updatedAt: new Date() };

        for (const key of allowed) {
            if (req.body[key] !== undefined) update[key] = req.body[key];
        }

        await users.updateOne({ _id: new ObjectId(req.user!.userId) }, { $set: update });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Get Favorites
router.get('/favorites', authenticate, async (req: AuthRequest, res) => {
    try {
        const users = await getCollection('users');
        const properties = await getCollection('properties');

        const user = await users.findOne({ _id: new ObjectId(req.user!.userId) });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const favoriteIds = (user.favorites || []).map((id: string) => {
            try { return new ObjectId(id); } catch { return null; }
        }).filter(Boolean);

        const results = await properties.find({ _id: { $in: favoriteIds } }).toArray();
        res.json({ success: true, properties: results });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

// Toggle Favorite
router.post('/favorites', authenticate, async (req: AuthRequest, res) => {
    try {
        const { propertyId } = req.body;
        const users = await getCollection('users');

        const user = await users.findOne({ _id: new ObjectId(req.user!.userId) });
        const isFavorited = (user!.favorites || []).includes(propertyId);

        if (isFavorited) {
            await users.updateOne(
                { _id: new ObjectId(req.user!.userId) },
                { $pull: { favorites: propertyId } }
            );
        } else {
            await users.updateOne(
                { _id: new ObjectId(req.user!.userId) },
                { $addToSet: { favorites: propertyId } }
            );
        }

        res.json({ success: true, isFavorited: !isFavorited });
    } catch (error) {
        res.status(500).json({ error: 'Failed to toggle favorite' });
    }
});

// Admin: Get All Users
router.get('/', authenticate, async (req: AuthRequest, res) => {
    if (req.user!.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    try {
        const usersCollection = await getCollection('users');
        const users = await usersCollection.find({}).toArray();
        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

export default router;
