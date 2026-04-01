import jwt from 'jsonwebtoken';

// paylod example
// {
//   userId: user._id,
//   role: user.role
// }

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};