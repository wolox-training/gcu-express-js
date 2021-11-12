// eslint-disable-next-line new-cap
const router = require('express').Router();
const userInteractor = require('../interactors/userInteractor');
const asyncWrapper = require('../utils/asyncWrapper');
const validateSchema = require('../middlewares/validateSchema');
const isAdminValidation = require('../middlewares/isAdminValidation');
const { userSchema } = require('../validations');
const userMapper = require('../mappers/userMapper');
const httpCodes = require('../constants/httpCodes');
const checkJwt = require('../middlewares/checkJwt');

router.post(
  '/users',
  [validateSchema(userSchema), checkJwt, isAdminValidation],
  asyncWrapper(async (req, res) => {
    const { user, token } = await userInteractor.createUserAdmin(req.body);
    return res.status(token ? httpCodes.CREATED : httpCodes.OK).json({ user: userMapper(user), token });
  })
);

module.exports = router;
