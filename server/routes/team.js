import express from 'express';
import mongoose from 'mongoose';
import TeamMember from '../models/TeamMember.js';
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
    const team = await TeamMember.find().sort({ order: 1 });
    res.json(team);
  } catch (error) {
    console.error('Error fetching team:', error.message);
    res.json([]); // Return empty array instead of error
  }
});

router.post('/', auth, adminAuth, upload.single('image'), async (req, res) => {
  try {
    let imageUrl = req.body.image || '';
    
    // If file is uploaded, upload to Cloudinary
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'real-estate-club/team');
    }
    
    const memberData = {
      ...req.body,
      image: imageUrl
    };
    
    const member = new TeamMember(memberData);
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', auth, adminAuth, upload.single('image'), async (req, res) => {
  try {
    console.log('PUT /team/:id - Request body:', req.body);
    console.log('PUT /team/:id - File:', req.file ? 'File uploaded' : 'No file');
    
    const existingMember = await TeamMember.findById(req.params.id);
    if (!existingMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    let imageUrl = existingMember.image; // Keep existing image by default
    
    // If new file is uploaded, try to upload to Cloudinary
    if (req.file) {
      try {
        // Only delete old image if it's a Cloudinary URL
        if (existingMember.image && existingMember.image.includes('cloudinary')) {
          await deleteFromCloudinary(existingMember.image);
        }
        imageUrl = await uploadToCloudinary(req.file.buffer, 'real-estate-club/team');
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(400).json({ 
          message: 'Image upload failed. Please check Cloudinary configuration or use image URL instead.',
          error: uploadError.message 
        });
      }
    } else if (req.body.image) {
      // If image URL is provided, use it
      imageUrl = req.body.image;
    }
    
    const memberData = {
      name: req.body.name || existingMember.name,
      role: req.body.role || existingMember.role,
      bio: req.body.bio || existingMember.bio,
      linkedin: req.body.linkedin || existingMember.linkedin,
      order: req.body.order !== undefined ? req.body.order : existingMember.order,
      image: imageUrl
    };
    
    const member = await TeamMember.findByIdAndUpdate(req.params.id, memberData, { new: true });
    res.json(member);
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (member && member.image) {
      await deleteFromCloudinary(member.image);
    }
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team member deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
