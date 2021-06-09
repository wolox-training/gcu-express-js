const calificationService = require('../services/calificationService');
const CalificationModel = require('../models').calification;
const weetService = require('../services/weetsService');
const userService = require('../services/userService');
const errorMessages = require('../constants/errorMessages');
const { notFoundError } = require('../errors');

exports.rateWeet = async body => {
  const user = await userService.findUserByEmail(body.email);
  if (!user) throw notFoundError(errorMessages.userNotFound);

  const weet = await weetService.findWeetById(body.weetId);
  if (!weet) throw notFoundError(errorMessages.userNotFound);

  const weetAuthor = await userService.findUserById(weet.userId);
  if (!weetAuthor) throw notFoundError(errorMessages.weetNotFound);

  const [rating] = await CalificationModel.findOrCreate({
    where: { id: 1 }
  });

  console.log(rating);

  const transaction = await calificationService.startTransaction(rating, weetAuthor, body.score);

  return transaction;
};
