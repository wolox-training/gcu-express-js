const router = require('express').Router();
const userInteractor = require('../interactors/userInteractor');
const asyncWrapper = require('../utils/asyncWrapper');
const checkValidations = require('../validations');
const userValidations = require('../validations/userValidations');
const UserMapper = require('../mappers/userMapper');
const httpCodes = require('../constants/httpCodes');

router.post(
  '/signup',
  [userValidations.validateRegister, checkValidations],
  asyncWrapper(async (req, res) => {
    const { user, token } = await userInteractor.signUp(req.body);
    return res
      .status(httpCodes.CREATED)
      .json({ user: UserMapper(user), token });
  })
);

module.exports = router;
