const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) return res.sendStatus(401);

    const token = authHeader.split('Bearer ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload.id || !payload.role) return res.sendStatus(401);

    req.user = payload;
  } catch (err) {
    return res.sendStatus(401);
  }

  return next();
};
