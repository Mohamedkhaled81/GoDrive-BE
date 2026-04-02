import { transporter } from '../config/mail.js';

export const sendOTPEmail = async (email, code, type) => {
  let subject = '';
  let text = '';

  if (type === 'verify') {
    subject = 'Verify Your Account';
    text = `Your verification OTP is: ${code}`;
  }

  if (type === 'login') {
    subject = 'Login OTP';
    text = `Your login OTP is: ${code}`;
  }

  if (type === 'reset') {
    subject = 'Reset Password OTP';
    text = `Your password reset OTP is: ${code}`;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text,
  });
};