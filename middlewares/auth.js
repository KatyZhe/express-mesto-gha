const jwt = require('jsonwebtoken');
const { UnauthorizedErr } = require('../errors/UnauthorizedErr');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw UnauthorizedErr();
  }
  req.user = payload;
  return next();
};