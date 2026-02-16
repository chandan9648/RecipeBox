const nodemailer = require("nodemailer");

exports.sendEmail = async (to, subject, text) => {
  if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL/EMAIL_PASS missing in backend env");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    text
  });
};
