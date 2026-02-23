const nodemailer = require("nodemailer");

exports.sendEmail = async (to, subject, text) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER/EMAIL_PASS missing in backend env");
  }

  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : undefined;
  const pass = String(process.env.EMAIL_PASS).replace(/\s+/g, "");

  const transporter = host && port
    ? nodemailer.createTransport({
        host,
        port,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass,
        },
      })
    : nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass,
        },
      });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  });
};


