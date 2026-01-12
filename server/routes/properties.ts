import express from 'express';
import { getCollection } from '../db';
import { ObjectId } from 'mongodb';
import { authenticate, AuthRequest } from '../middleware/auth';
import multer from 'multer';
import { uploadToCloudinary } from '../utils/cloudinary';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get Properties (with filtering and pagination)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, listingType, propertyType, minPrice, maxPrice, location } = req.query;
    const properties = await getCollection('properties');

    const query: any = {
      status: 'approved' // Only show approved properties (matching web app)
    };
    if (listingType) query.listingType = listingType;
    if (propertyType) query.propertyType = propertyType;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice as string);
      if (maxPrice) query.price.$lte = parseInt(maxPrice as string);
    }
    if (location) query.location = { $regex: location as string, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const results = await properties.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .toArray();

    res.json({
      success: true,
      properties: results,
      page: Number(page),
    });
  } catch (error) {
    console.error('Fetch properties error:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get Single Property
router.get('/:id', async (req, res) => {
  try {
    const properties = await getCollection('properties');
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    const property = await properties.findOne({ _id: new ObjectId(id) });
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Create Property (requires auth)
router.post('/', authenticate, upload.array('images'), async (req: AuthRequest, res) => {
  try {
    const properties = await getCollection('properties');
    const users = await getCollection('users');

    const agent = await users.findOne({ _id: new ObjectId(req.user!.userId) });

    let images: string[] = [];

    // Handle files from multer if any
    if (req.files && Array.isArray(req.files)) {
      const uploadPromises = (req.files as any[]).map(file => {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        return uploadToCloudinary(dataURI, 'dwelas/properties');
      });
      images = await Promise.all(uploadPromises);
    }
    // Handle base64 strings in body if any
    else if (req.body.images && Array.isArray(req.body.images)) {
      const uploadPromises = req.body.images.map((img: string) => {
        if (img.startsWith('http')) return img;
        return uploadToCloudinary(img, 'dwelas/properties');
      });
      images = await Promise.all(uploadPromises);
    }

    const newProperty = {
      ...req.body,
      price: parseInt(req.body.price),
      bedrooms: parseInt(req.body.bedrooms) || 0,
      bathrooms: parseInt(req.body.bathrooms) || 0,
      sqft: parseInt(req.body.sqft) || 0,
      yearBuilt: req.body.yearBuilt ? parseInt(req.body.yearBuilt) : undefined,
      images,
      agent: {
        _id: agent!._id,
        name: agent!.name,
        email: agent!.email,
      },
      verified: false,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await properties.insertOne(newProperty);
    res.status(201).json({ success: true, propertyId: result.insertedId });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Approve Property (Admin only)
router.put('/approval/:id', authenticate, async (req: AuthRequest, res) => {
  if (req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const properties = await getCollection('properties');
    const { verified } = req.body;
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];

    await properties.updateOne(
      { _id: new ObjectId(id) },
      { $set: { verified, updatedAt: new Date() } }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update property status' });
  }
});

export default router;
