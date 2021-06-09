const httpCodes = require('../constants/httpCodes');
const weetInteractor = require('../interactors/weetInteractor');
const weetService = require('../services/weetsService');
const weetMapper = require('../mappers/weetMapper');
const asyncWrapper = require('../utils/asyncWrapper');

exports.getWeets = asyncWrapper(async (req, res) => {
  const { results, pagination } = await weetService.getAllWeets(req.query);
  return res.status(httpCodes.OK).json({ weets: results.map(u => weetMapper(u)), pagination });
});

exports.createWeet = asyncWrapper(async (req, res) => {
  const weet = await weetInteractor.createWeet({
    ...req.body,
    userId: req.user.id,
    email: req.user.email
  });
  return res.status(httpCodes.CREATED).json(weetMapper(weet));
});
