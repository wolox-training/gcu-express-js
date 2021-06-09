const calificationService = require('../services/calificationService');
const CalificationModel = require('../models').calification;
const weetService = require('../services/weetsService');
const userService = require('../services/userService');
const errorMessages = require('../constants/errorMessages');
const { notFoundError } = require('../errors');

exports.rateWeet = async body => {
  const ratingUser = await userService.findUserByEmail(body.email);
  if (!ratingUser) throw notFoundError(errorMessages.userNotFound);

  const weet = await weetService.findWeetById(body.weetId);
  if (!weet) throw notFoundError(errorMessages.weetNotFound);

  const weetAuthor = await userService.findUserById(weet.userId);
  if (!weetAuthor) throw notFoundError(errorMessages.weetAuthorNotFound);

  const [rating] = await CalificationModel.findOrCreate({
    where: { weetId: body.weetId, ratingUserId: ratingUser.id }
  });

  const transaction = await calificationService.startTransaction(rating, weetAuthor, body.score);

  return transaction;
};
