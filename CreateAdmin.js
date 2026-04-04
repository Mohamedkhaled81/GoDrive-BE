import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });

    if (existingAdmin) {
      console.log('⚠️ Admin already exists');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    await User.create({
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
    });

    console.log('✅ Admin created successfully');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();