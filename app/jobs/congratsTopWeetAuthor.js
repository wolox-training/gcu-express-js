const { CronJob } = require('cron');
const userService = require('../services/userService');
const logger = require('../logger');
const asyncWrapper = require('../utils/asyncWrapper');
const sendEmail = require('../utils/sendEmail');
const templates = require('../constants/templates');

const sendCongratulationEmail = asyncWrapper(async () => {
  const topWeetAuthor = await userService.findTopWeetAuthor();

  if (topWeetAuthor) {
    await sendEmail(
      topWeetAuthor.email,
      templates.congratulationsEmail.subject,
      templates.congratulationsEmail.text(topWeetAuthor.email)
    );
    logger.info(`Congratulations email sent to ${topWeetAuthor.email}`);
  } else logger.info('User top not found');
});

module.exports = {
  congratsJob: new CronJob('*/30 * * * * *', () => sendCongratulationEmail()),
  sendCongratulationEmail
};
