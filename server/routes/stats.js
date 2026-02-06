import express from 'express';
import mongoose from 'mongoose';
import Event from '../models/Event.js';
import TeamMember from '../models/TeamMember.js';
import Gallery from '../models/Gallery.js';
import Membership from '../models/Membership.js';

const router = express.Router();

// Public endpoint to get site statistics
router.get('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        events: 0,
        members: 500,
        teamMembers: 0,
        galleryImages: 0,
        partners: 50,
        years: 5
      });
    }

    const [eventsCount, approvedMembersCount, teamCount, galleryCount] = await Promise.all([
      Event.countDocuments(),
      Membership.countDocuments({ status: 'approved' }),
      TeamMember.countDocuments(),
      Gallery.countDocuments()
    ]);

    res.json({
      events: eventsCount,
      members: approvedMembersCount || 500, // Fallback to 500 if no approved members
      teamMembers: teamCount,
      galleryImages: galleryCount,
      partners: 50, // Static - can be made dynamic later
      years: 5 // Static - can be calculated from founding date later
    });
  } catch (error) {
    console.error('Error fetching stats:', error.message);
    // Return default values on error
    res.json({
      events: 0,
      members: 500,
      teamMembers: 0,
      galleryImages: 0,
      partners: 50,
      years: 5
    });
  }
});

export default router;
