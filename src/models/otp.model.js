import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  code: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ['verify', 'login', 'reset'],
    required: true,
  },

  expiresAt: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true
});

//Only one OTP per type per user
otpSchema.index({ userId: 1, type: 1 }, { unique: true });

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;