const jwt = require('jsonwebtoken');
const SessionModel = require('../models').session;

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) return res.sendStatus(401);

    const token = authHeader.split('Bearer ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload.id || !payload.role) return res.sendStatus(401);

    const oldSession = await SessionModel.findAll({
      where: { userId: payload.id },
      order: [['createdAt', 'DESC']],
      limit: 1
    });

    if (oldSession[0] && payload.iat <= oldSession[0].logoutTime) return res.sendStatus(401);

    // eslint-disable-next-line require-atomic-updates
    req.user = payload;
  } catch (err) {
    return res.sendStatus(401);
  }

  return next();
};
