import express from 'express';
import mongoose from 'mongoose';
import Event from '../models/Event.js';
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
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error.message);
    res.json([]); // Return empty array instead of error
  }
});

router.post('/', auth, adminAuth, upload.single('image'), async (req, res) => {
  try {
    let imageUrl = req.body.image || '';
    
    // If file is uploaded, upload to Cloudinary
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'real-estate-club/events');
    }
    
    const eventData = {
      ...req.body,
      image: imageUrl
    };
    
    const event = new Event(eventData);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', auth, adminAuth, upload.single('image'), async (req, res) => {
  try {
    const existingEvent = await Event.findById(req.params.id);
    let imageUrl = req.body.image || existingEvent.image;
    
    // If new file is uploaded, upload to Cloudinary and delete old image
    if (req.file) {
      if (existingEvent.image) {
        await deleteFromCloudinary(existingEvent.image);
      }
      imageUrl = await uploadToCloudinary(req.file.buffer, 'real-estate-club/events');
    }
    
    const eventData = {
      ...req.body,
      image: imageUrl
    };
    
    const event = await Event.findByIdAndUpdate(req.params.id, eventData, { new: true });
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event && event.image) {
      await deleteFromCloudinary(event.image);
    }
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
