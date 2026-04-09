const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/apiResponse');
const { pool } = require('../config/db');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 'Not authorised – no token provided', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB to ensure they still exist and are active
    const [rows] = await pool.query(
      'SELECT id, full_name, email, role, is_active FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!rows.length || !rows[0].is_active) {
      return sendError(res, 'User not found or has been deactivated', 401);
    }

    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') return sendError(res, 'Invalid token', 401);
    if (err.name === 'TokenExpiredError') return sendError(res, 'Token expired', 401);
    next(err);
  }
};

module.exports = protect;
