const router = require('express').Router();
const userService = require('../services/userService');
const asyncWrapper = require('../utils/asyncWrapper');
const checkValidations = require('../validations');
const userValidations = require('../validations/userValidations');
const UserMapper = require('../mappers/userMapper');

router.post(
  '/signup',
  [userValidations.validateRegister, checkValidations],
  asyncWrapper(async (req, res) => {
    const { user, token } = await userService.signUp(req.body);
    return res.status(200).json({ user: UserMapper(user), token });
  })
);

module.exports = router;
