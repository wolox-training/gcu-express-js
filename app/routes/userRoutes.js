// eslint-disable-next-line new-cap
const router = require('express').Router();
const userInteractor = require('../interactors/userInteractor');
const asyncWrapper = require('../utils/asyncWrapper');
const validateSchema = require('../middlewares/validateSchema');
const protectedRoute = require('../middlewares/protectedRoute');
const { userSchema, sessionSchema } = require('../validations');
const userMapper = require('../mappers/userMapper');
const httpCodes = require('../constants/httpCodes');

router.get(
  '/',
  [protectedRoute],
  asyncWrapper(async (req, res) => {
    const { results, pagination } = await userInteractor.getUsers(req.query);
    return res.status(httpCodes.OK).json({ users: results.map(u => userMapper(u)), pagination });
  })
);

router.post(
  '/signup',
  [validateSchema(userSchema)],
  asyncWrapper(async (req, res) => {
    const { user, token } = await userInteractor.signUp(req.body);
    return res.status(httpCodes.CREATED).json({ user: userMapper(user), token });
  })
);

router.post(
  '/sessions',
  [validateSchema(sessionSchema)],
  asyncWrapper(async (req, res) => {
    const { user, token } = await userInteractor.signIn(req.body);
    return res.status(httpCodes.OK).json({ user: userMapper(user), token });
  })
);

module.exports = router;
