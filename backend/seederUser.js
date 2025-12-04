import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import connectDB from './config/db.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    // Clear existing users
    await User.deleteMany();

    // Create users one by one so pre-save hook runs
    const adminUser = new User({
      name: 'Lakshmanan',
      email: 'admin@example.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '8489539353',
      
    });

    const Suresh = new User({
      name: 'Suresh',
      email: 'suresh@example.com',
      password: 'Collector@123',
      role: 'Collecting Agent',
      phone: '9876543210',
     
    });
    
    

    await adminUser.save();
    await Suresh.save();
    
    

    console.log('✅ Users seeded successfully with hashed passwords!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error seeding users: ${error.message}`);
    process.exit(1);
  }
};

importData();
