import User from '../models/user.model.js';
import OTP from '../models/otp.model.js';

import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateOTP } from '../utils/otp.js';
import { generateToken } from '../utils/jwt.js';
import { isValidPassword } from '../utils/passwordValidator.js';


const createOTP = async (userId, type) => {

  await OTP.deleteMany({ userId, type });

  const code = generateOTP();

  const otp = await OTP.create({
    userId,
    code,
    type,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  });

  return otp;
};


const verifyOTP = async (userId, code, type) => {
  const otp = await OTP.findOne({ userId, code, type });

  if (!otp) {
    throw new Error('Invalid OTP');
  }

  if (otp.expiresAt < new Date()) {
    await OTP.deleteOne({ _id: otp._id });
    throw new Error('OTP expired');
  }


  await OTP.deleteOne({ _id: otp._id });

  return true;
};

export const authService = {

  
  async register(email, password) {
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    
    if (!isValidPassword(password)) {
      throw new Error('Weak password');
    }


    const hashedPassword = await hashPassword(password);

   
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    
    await createOTP(user._id, 'verify');

    return { message: 'OTP sent to email for verification' };
  },

  
  async verifyAccount(email, code) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    await verifyOTP(user._id, code, 'verify');

    user.isVerified = true;
    await user.save();

    return { message: 'Account verified successfully' };
  },


  async login(email, password) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new Error('Account not verified');
    }

  
    await createOTP(user._id, 'login');

    return { message: 'OTP sent to email' };
  },

  async verifyLogin(email, code) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    await verifyOTP(user._id, code, 'login');

    // generate token
    const token = generateToken({
      userId: user._id,
      role: user.role,
    });

    return { token };
  },

  
  async forgotPassword(email) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    await createOTP(user._id, 'reset');

    return { message: 'OTP sent to email' };
  },

  
  async resetPassword(email, code, newPassword) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    await verifyOTP(user._id, code, 'reset');

    if (!isValidPassword(newPassword)) {
      throw new Error('Weak password');
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return { message: 'Password reset successful' };
  }
};