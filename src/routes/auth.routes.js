import express from 'express';
import { authController } from '../controllers/auth.controller.js';

import { validate } from '../middlewares/validation.middleware.js';
import {
  registerValidator,
  loginValidator,
} from '../middlewares/auth.validator.js';

const router = express.Router();


router.post(
  '/register',
  registerValidator,
  validate,
  authController.register
);


router.post('/verify-account', authController.verifyAccount);


router.post(
  '/login',
  loginValidator,
  validate,
  authController.login
);


router.post('/verify-login', authController.verifyLogin);


router.post('/forgot-password', authController.forgotPassword);


router.post('/reset-password', authController.resetPassword);

export default router;