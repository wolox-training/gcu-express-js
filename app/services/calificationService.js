const db = require('../models');
const logger = require('../logger');

exports.startTransaction = async (rating, user, score) => {
  let transaction = {};
  try {
    transaction = await db.sequelize.transaction();
    logger.info('Transaction started.');

    if (rating.score !== score) {
      await user.increment('points', { by: score, transaction });
      await rating.set('score', score);
      await rating.save({ transaction });
    }

    await transaction.commit();
  } catch (err) {
    if (transaction.rollback) await transaction.rollback();
    throw err;
  }
};
