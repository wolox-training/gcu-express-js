const nodemailer = require('nodemailer');
const logger = require('../logger');

const {
  emails: { auth }
} = require('../../config').common;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth,
  secure: false
});

const sendEmail = async (to, subject, body) => {
  try {
    const { messageId } = await transporter.sendMail({
      from: 'noreply@wolox.com.ar',
      to,
      subject,
      text: body
    });
    logger.info(`Email sent: ${messageId}`);
  } catch (err) {
    logger.info(`Email error: ${err.message}`);
  }
};

module.exports = sendEmail;
