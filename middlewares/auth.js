const jwt = require('jsonwebtoken');
const { Errors } = require('../errors/Errors.js');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw Errors.unauthorized();
  }
  req.user = payload;
  return next();
};