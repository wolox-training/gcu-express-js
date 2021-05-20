const router = require('express').Router();
const authService = require('../services/authService');
const asyncWrapper = require('../utils/asyncWrapper');
const checkValidations = require('../validations');
const userValidations = require('../validations/userValidations');

router.post(
  '/signup',
  [userValidations.validateRegister, checkValidations],
  asyncWrapper(async (req, res) => {
    const { user, token } = await authService.signUp(req.body);
    return res.status(200).json({ user, token });
  })
);

module.exports = router;
