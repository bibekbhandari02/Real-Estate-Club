import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String },
  location: { type: String },
  speaker: { type: String },
  image: { type: String },
  status: { type: String, enum: ['upcoming', 'past'], default: 'upcoming' }
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
