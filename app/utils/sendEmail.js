const nodemailer = require('nodemailer');
const logger = require('../logger');

const {
  emails: { auth }
} = require('../../config').common;

const transporter = nodemailer.createTransport({
  auth,
  secure: false
});

const sendEmail = async (to, subject, body) => {
  try {
    const { messageId } = await transporter.sendEmail({
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
