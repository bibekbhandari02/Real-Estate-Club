import express from 'express';
import mongoose from 'mongoose';
import Contact from '../models/Contact.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not available. Please try again later.' });
    }
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: 'Message sent successfully' });
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
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching contacts:', error.message);
    res.json([]); // Return empty array instead of error
  }
});

router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
