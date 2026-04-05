// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//     {
//         email: {
//             type: String,
//             required: true,
//             unique: true,
//         },
//         password: {
//             type: String,
//             required: true,
//         },
//         role: {
//             type: String,
//             enum: ["user", "admin"],
//             default: "user",
//         },
//         isVerified: {
//             type: Boolean,
//             default: false,
//         },
//     },
//     { timestamps: true },
// );

// export default mongoose.model("User", userSchema);
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
    },

    role: {
      type: String,
      enum: ['admin', 'customer'],
      default: 'customer',
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
