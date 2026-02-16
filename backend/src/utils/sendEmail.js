// const nodemailer = require("nodemailer");

// exports.sendEmail = async (to, subject, text) => {
//   const email = process.env.EMAIL_USER;
//   const emailPassRaw = process.env.EMAIL_PASS;

//   if (!email || !emailPassRaw) {
//     throw new Error("EMAIL/EMAIL_PASS missing in backend env");
//   }

//   const host = process.env.EMAIL_HOST;
//   const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : undefined;
//   // Gmail App Passwords are often shown with spaces; remove whitespace safely.
//   const pass = String(emailPassRaw).replace(/\s+/g, "");

//   // Prefer explicit SMTP config (more reliable on many hosts like Render)
//   const transporter = host && port
//     ? nodemailer.createTransport({
//         host,
//         port,
//         secure: port === 465,
//         auth: {
//           user: email,
//           pass,
//         },
//       })
//     : nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: email,
//           pass,
//         },
//       });

//   await transporter.sendMail({
//     from: email,
//     to,
//     subject,
//     text
//   });
// };

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


