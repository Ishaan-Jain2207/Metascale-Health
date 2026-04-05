const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ─── GET SYSTEM ANALYTICS ──────────────────────────────────────────────────
exports.getSystemAnalytics = async (req, res, next) => {
  try {
    const [userStats] = await pool.query(
      "SELECT role, COUNT(*) as count FROM users GROUP BY role"
    );
    
    const [screeningStats] = await pool.query(
      "SELECT 'liver' as type, COUNT(*) as count FROM liver_screenings UNION ALL SELECT 'diabetes' as type, COUNT(*) as count FROM diabetes_screenings"
    );

    const [monthlyTrend] = await pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count 
       FROM (SELECT created_at FROM liver_screenings UNION ALL SELECT created_at FROM diabetes_screenings) combined
       GROUP BY month ORDER BY month ASC LIMIT 12`
    );

    return sendSuccess(res, {
      users: userStats,
      screenings: screeningStats,
      trend: monthlyTrend
    });
  } catch (err) {
    next(err);
  }
};

// ─── MANAGE DOCTORS ────────────────────────────────────────────────────────
exports.getDoctors = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, full_name, email, specialization, hospital, is_approved, is_active FROM users WHERE role = 'doctor'"
    );
    return sendSuccess(res, rows);
  } catch (err) {
    next(err);
  }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    await pool.query("UPDATE users SET is_active = ? WHERE id = ?", [is_active ? 1 : 0, id]);
    return sendSuccess(res, {}, 'User status updated');
  } catch (err) {
    next(err);
  }
};

exports.approveDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE users SET is_approved = 1 WHERE id = ? AND role = 'doctor'", [id]);
    return sendSuccess(res, {}, 'Doctor approved');
  } catch (err) {
    next(err);
  }
};

exports.rejectDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE users SET is_approved = 0, is_active = 0 WHERE id = ? AND role = 'doctor'", [id]);
    return sendSuccess(res, {}, 'Doctor application rejected');
  } catch (err) {
    next(err);
  }
};

exports.revokeApproval = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE users SET is_approved = 0 WHERE id = ? AND role = 'doctor'", [id]);
    return sendSuccess(res, {}, 'Doctor approval revoked');
  } catch (err) {
    next(err);
  }
};
