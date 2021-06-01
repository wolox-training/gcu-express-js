// eslint-disable-next-line new-cap
const router = require('express').Router();
const weetInteractor = require('../interactors/weetInteractor');
const { getWeet } = require('../controllers/weetsController');
const protectedRoute = require('../middlewares/protectedRoute');
const asyncWrapper = require('../utils/asyncWrapper');
const weetMapper = require('../mappers/weetMapper');
const httpCodes = require('../constants/httpCodes');

router.get('/', [], getWeet);

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
