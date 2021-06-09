const httpCodes = require('../constants/httpCodes');
const calificationInteractor = require('../interactors/calificationInteractor');
const asyncWrapper = require('../utils/asyncWrapper');

exports.createCalification = asyncWrapper(async (req, res) => {
  await calificationInteractor.rateWeet({
    weetId: parseInt(req.params.id),
    email: req.user.email,
    score: parseInt(req.body.score)
  });
  return res.sendStatus(httpCodes.OK);
});
