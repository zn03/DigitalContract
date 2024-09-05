const nodemailer = require('nodemailer');

module.exports.sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      name: process.env.NAME,
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: to,
      subject: subject,
      html: html
    });
  } catch (error) {
    throw new Error(error);
  }
};
