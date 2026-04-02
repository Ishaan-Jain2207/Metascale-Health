const { sendError } = require('../utils/apiResponse');

/**
 * Role-based access control middleware.
 * Usage: authorize('admin', 'doctor')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        `Role '${req.user.role}' is not permitted to access this resource`,
        403
      );
    }
    next();
  };
};

module.exports = authorize;
