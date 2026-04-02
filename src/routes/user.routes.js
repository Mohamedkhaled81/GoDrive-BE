//Create Protected Test Route

import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();


router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    message: 'User profile accessed',
    user: req.user,
  });
});


router.get(
  '/admin',
  authMiddleware,
  authorize('admin'),
  (req, res) => {
    res.json({
      message: 'Welcome Admin 👑',
    });
  }
);

export default router;