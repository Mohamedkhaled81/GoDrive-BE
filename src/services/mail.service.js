// import sgMail from "@sendgrid/mail";
import { transporter } from '../config/mail.js';
import dotenv from 'dotenv';
dotenv.config()

export const sendOTPEmail = async (email, code, type) => {
  // sgMail.setApiKey(process..env.sendGrid);
  // console.log('EMAIL_USER:', process..env.EMAIL_USER);
  // console.log('EMAIL_PASS:', process..env.EMAIL_PASSWORD);
  let subject = "";
  let text = "";

  if (type === "verify") {
    subject = "Verify Your Account";
    text = `Your verification OTP is: ${code}`;
  }

  if (type === "login") {
    subject = "Login OTP";
    text = `Your login OTP is: ${code}`;
  }

  if (type === "reset") {
    subject = "Reset Password OTP";
    text = `Your password reset OTP is: ${code}`;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text,
  });

  // const msg = {
  //   to: email,
  //   from: process..env.EMAIL_USER,
    
  //   subject,
  //   text,
  // };

  // await sgMail.send(msg);
};
