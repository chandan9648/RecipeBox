// const nodemailer = require("nodemailer");

// exports.sendEmail = async (to, subject, text) => {
//   if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
//     throw new Error("EMAIL/EMAIL_PASS missing in backend env");
//   }

//   const host = process.env.EMAIL_HOST;
//   const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : undefined;
//   const pass = String(process.env.EMAIL_PASS).replace(/\s+/g, "");


//   console.log("EMAIL_USER:", process.env.EMAIL_USER);
//   console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

//   // Prefer explicit SMTP config (more reliable on many hosts like Render)
//   const transporter = host && port
//     ? nodemailer.createTransport({
//         host,
//         port,
//         secure: port === 465,
//         auth: {
//           user: process.env.EMAIL,
//           pass,
//         },
//       })
//     : nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.EMAIL,
//           pass,
//         },
//       });

//   await transporter.sendMail({
//     from: process.env.EMAIL,
//     to,
//     subject,
//     text
//   });
// };



const nodemailer = require("nodemailer");

exports.sendEmail = async (to, subject, text) => {
  const emailUser = process.env.EMAIL || process.env.EMAIL_USER;
  if (!emailUser || !process.env.EMAIL_PASS) {
    throw new Error("Email env missing: set EMAIL (or EMAIL_USER) and EMAIL_PASS");
  }

  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : undefined;
  const pass = String(process.env.EMAIL_PASS).replace(/\s+/g, "");

  if (process.env.NODE_ENV !== 'production') {
    console.log('Email config:', {
      hasUser: Boolean(emailUser),
      hasPass: Boolean(process.env.EMAIL_PASS),
      host: host || null,
      port: port || null,
    });
  }

  // Prefer explicit SMTP config (more reliable on many hosts like Render)
  const transporter = host && port
    ? nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user: emailUser,
          pass,
        },
      })
    : nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass,
        },
      });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || emailUser,
      to,
      subject,
      text,
    });
  } catch (err) {
    const code = err?.code ? ` (code: ${err.code})` : '';
    throw new Error(`Failed to send email${code}: ${err?.message || String(err)}`);
  }
};
