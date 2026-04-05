// testEmail.js
import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process..env.EMAIL_USER,
//     pass: process..env.EMAIL_PASSWORD,
//   },
// });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: "omarezzat.m2002@gmail.com",
    pass: "lphmdoztopuuxijd",
  },
});

// try {
//   await transporter.verify();
//   console.log("Server is ready to take our messages");
// } catch (err) {
//   console.error("Verification failed:", err);
// }

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: "marionasef22@gmail.com",
  subject: 'Test',
  text: 'Hello',
});

console.log('Email sent');