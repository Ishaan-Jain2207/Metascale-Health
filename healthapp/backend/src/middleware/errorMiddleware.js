const { sendError } = require('../utils/apiResponse');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message    = err.message || 'Internal Server Error';

  sendError(res, message, statusCode);
};

module.exports = errorHandler;
