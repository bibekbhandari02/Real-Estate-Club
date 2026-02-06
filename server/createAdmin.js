import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@realestateclub.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      
      // Update password
      existingAdmin.password = 'admin123';
      await existingAdmin.save();
      console.log('✅ Admin password updated to: admin123');
    } else {
      // Create new admin
      const admin = new User({
        email: 'admin@realestateclub.com',
        password: 'admin123',
        role: 'admin'
      });
      
      await admin.save();
      console.log('✅ Admin user created successfully!');
    }

    console.log('\n📋 Admin Credentials:');
    console.log('   Email: admin@realestateclub.com');
    console.log('   Password: admin123');
    console.log('\n🔐 Login at: http://localhost:3000/login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();
