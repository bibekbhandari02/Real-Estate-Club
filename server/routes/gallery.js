import express from 'express';
import mongoose from 'mongoose';
import Gallery from '../models/Gallery.js';
import { auth, adminAuth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/uploadToCloudinary.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    const images = await Gallery.find().sort({ order: 1 });
    res.json(images);
  } catch (error) {
    console.error('Error fetching gallery:', error.message);
    res.json([]); // Return empty array instead of error
  }
});

router.post('/', auth, adminAuth, upload.single('image'), async (req, res) => {
  try {
    let imageUrl = req.body.image || '';
    
    // If file is uploaded, upload to Cloudinary
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'real-estate-club/gallery');
    }
    
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image is required' });
    }
    
    const galleryData = {
      ...req.body,
      image: imageUrl
    };
    
    const image = new Gallery(galleryData);
    await image.save();
    res.status(201).json(image);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', auth, adminAuth, upload.single('image'), async (req, res) => {
  try {
    const existingImage = await Gallery.findById(req.params.id);
    let imageUrl = req.body.image || existingImage.image;
    
    // If new file is uploaded, upload to Cloudinary and delete old image
    if (req.file) {
      if (existingImage.image) {
        await deleteFromCloudinary(existingImage.image);
      }
      imageUrl = await uploadToCloudinary(req.file.buffer, 'real-estate-club/gallery');
    }
    
    const galleryData = {
      ...req.body,
      image: imageUrl
    };
    
    const image = await Gallery.findByIdAndUpdate(req.params.id, galleryData, { new: true });
    res.json(image);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (image && image.image) {
      await deleteFromCloudinary(image.image);
    }
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
