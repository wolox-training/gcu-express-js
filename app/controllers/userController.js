const httpCodes = require('../constants/httpCodes');
const userInteractor = require('../interactors/userInteractor');
const userMapper = require('../mappers/userMapper');
const userService = require('../services/userService');
const asyncWrapper = require('../utils/asyncWrapper');

exports.getUsers = asyncWrapper(async (req, res) => {
  const { results, pagination } = await userInteractor.getUsers(req.query);
  return res.status(httpCodes.OK).json({ users: results.map(u => userMapper(u)), pagination });
});

exports.createUser = asyncWrapper(async (req, res) => {
  const { user, token } = await userInteractor.signUp(req.body);
  return res.status(httpCodes.CREATED).json({ user: userMapper(user), token });
});

exports.session = asyncWrapper(async (req, res) => {
  const { user, token } = await userInteractor.signIn(req.body);
  return res.status(httpCodes.OK).json({ user: userMapper(user), token });
});

exports.login = asyncWrapper(async (req, res) => {
  const tokens = await userInteractor.auth0(req.body.code);
  return res.status(httpCodes.OK).json(tokens);
});

exports.deleteSessions = asyncWrapper(async (req, res) => {
  await userService.destroySession(req.user.id);
  return res.sendStatus(httpCodes.OK);
});
