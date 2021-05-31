// eslint-disable-next-line new-cap
const router = require('express').Router();
const userInteractor = require('../interactors/userInteractor');
const asyncWrapper = require('../utils/asyncWrapper');
const validateSchema = require('../middlewares/validateSchema');
// const protectedRoute = require('../middlewares/protectedRoute');
const { userSchema } = require('../validations');
const userMapper = require('../mappers/userMapper');
const httpCodes = require('../constants/httpCodes');

router.post(
  '/users',
  [validateSchema(userSchema)],
  asyncWrapper(async (req, res) => {
    const { user, token } = await userInteractor.createUserAdmin(req.body);
    return res.status(httpCodes.CREATED).json({ user: userMapper(user), token });
  })
);

module.exports = router;
