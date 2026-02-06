import express from 'express';
import mongoose from 'mongoose';
import Membership from '../models/Membership.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not available. Please try again later.' });
    }
    const membership = new Membership(req.body);
    await membership.save();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', auth, adminAuth, async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    const memberships = await Membership.find().sort({ createdAt: -1 });
    res.json(memberships);
  } catch (error) {
    console.error('Error fetching memberships:', error.message);
    res.json([]); // Return empty array instead of error
  }
});

router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const membership = await Membership.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(membership);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
