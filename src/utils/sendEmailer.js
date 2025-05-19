const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // misal: ruangamanbersama@gmail.com
    pass: process.env.EMAIL_PASS  // gunakan app password, bukan password biasa
  }
});

exports.sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"Ruang Aman Bersama" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};