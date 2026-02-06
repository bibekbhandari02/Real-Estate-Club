import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String },
  image: { type: String },
  linkedin: { type: String },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('TeamMember', teamMemberSchema);
