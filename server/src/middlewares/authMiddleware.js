const ErrorApi = require('../exceptions/error-api');
// const { validateAccessToken } = require('../services/tokenService');

module.exports = async function authMiddleware(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return next(ErrorApi.UnauthorizedError());
    }

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(ErrorApi.UnauthorizedError());
    }

    const userData = await validateAccessToken(accessToken);
    if (!userData) {
      return next(ErrorApi.UnauthorizedError());
    }

    req.user = userData;
    return next();
  } catch (err) {
    return next(ErrorApi.UnauthorizedError());
  }
};
