const nodemailer = require("nodemailer");

exports.sendEmail = async (to, subject, text) => {
  if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL/EMAIL_PASS missing in backend env");
  }

  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : undefined;
  const pass = String(process.env.EMAIL_PASS).replace(/\s+/g, "");

  // Prefer explicit SMTP config (more reliable on many hosts like Render)
  const transporter = host && port
    ? nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user: process.env.EMAIL,
          pass,
        },
      })
    : nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass,
        },
      });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    text
  });
};
