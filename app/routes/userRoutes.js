// eslint-disable-next-line new-cap
const router = require('express').Router();
const userInteractor = require('../interactors/userInteractor');
const asyncWrapper = require('../utils/asyncWrapper');
const checkValidations = require('../validations');
const userValidations = require('../validations/userValidations');
const userMapper = require('../mappers/userMapper');
const httpCodes = require('../constants/httpCodes');

router.post(
  '/signup',
  [userValidations.validateRegister, checkValidations],
  asyncWrapper(async (req, res) => {
    const { user, token } = await userInteractor.signUp(req.body);
    return res.status(httpCodes.CREATED).json({ user: userMapper(user), token });
  })
);

module.exports = router;
