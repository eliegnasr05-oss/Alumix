require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOTPEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"Alumix Security" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset OTP",
    html: `
      <h2>Alumix Password Reset</h2>
      <p>Your OTP code:</p>
      <h1>${otp}</h1>
      <p>Expires in 5 minutes</p>
    `
  });
};
