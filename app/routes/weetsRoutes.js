// eslint-disable-next-line new-cap
const router = require('express').Router();
const weetInteractor = require('../interactors/weetInteractor');
const protectedRoute = require('../middlewares/protectedRoute');
const asyncWrapper = require('../utils/asyncWrapper');
const weetMapper = require('../mappers/weetMapper');
const httpCodes = require('../constants/httpCodes');
const validateSchema = require('../middlewares/validateSchema');
const { paginationSchema } = require('../validations');

router.get(
  '/',
  [protectedRoute, validateSchema(paginationSchema)],
  asyncWrapper(async (req, res) => {
    const { results, pagination } = await weetInteractor.getWeets(req.query);
    return res.status(httpCodes.OK).json({ weets: results.map(u => weetMapper(u)), pagination });
  })
);

router.post(
  '/',
  [protectedRoute],
  asyncWrapper(async (req, res) => {
    const weet = await weetInteractor.createWeet({
      ...req.body,
      userId: req.user.id,
      email: req.user.email
    });
    return res.status(httpCodes.CREATED).json(weetMapper(weet));
  })
);

module.exports = router;
