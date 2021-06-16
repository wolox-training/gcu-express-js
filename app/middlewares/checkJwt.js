const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

module.exports = (req, res, next) => {
  try {
    const checkJwt = jwt({
      secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
      }),
      aud: process.env.AUTH0_AUDIENCE,
      algorithms: ['RS256']
    });

    return next(checkJwt);
  } catch (err) {
    return res.sendStatus(401);
  }
};
