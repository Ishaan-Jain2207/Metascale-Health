const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ─── GET ALL PATIENTS (Doctor View) ───────────────────────────────────────
exports.getAllPatients = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = `SELECT id, full_name, email, age, gender, phone, created_at 
                 FROM users WHERE role = 'patient'`;
    let params = [];

    if (search) {
      query += ` AND (full_name LIKE ? OR email LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY full_name ASC`;

    const [rows] = await pool.query(query, params);
    return sendSuccess(res, rows);
  } catch (err) {
    next(err);
  }
};

// ─── GET PATIENT DETAIL (Doctor View) ──────────────────────────────────────
exports.getPatientDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [userRows] = await pool.query(
      `SELECT id, full_name, email, age, gender, phone, blood_group, address,
              has_hypertension, has_diabetes, has_liver_condition, family_history_diabetes,
              current_medications, created_at
       FROM users WHERE id = ? AND role = 'patient'`,
      [id]
    );

    if (!userRows.length) return sendError(res, 'Patient not found', 404);

    // Get latest screenings
    const [liverRows] = await pool.query(
      `SELECT id, prediction, confidence, risk_band, created_at 
       FROM liver_screenings WHERE user_id = ? ORDER BY created_at DESC LIMIT 5`,
      [id]
    );

    const [diabetesRows] = await pool.query(
      `SELECT id, prediction, confidence, risk_band, created_at 
       FROM diabetes_screenings WHERE user_id = ? ORDER BY created_at DESC LIMIT 5`,
      [id]
    );

    return sendSuccess(res, {
      profile: userRows[0],
      history: {
        liver: liverRows,
        diabetes: diabetesRows
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── REVIEW SCREENING (Doctor View) ────────────────────────────────────────
exports.reviewScreening = async (req, res, next) => {
  try {
    const { id, type } = req.params;
    const { doctor_comment, doctor_flag } = req.body;
    const table = type === 'liver' ? 'liver_screenings' : 'diabetes_screenings';

    await pool.query(
      `UPDATE ${table} SET 
        doctor_id = ?, 
        doctor_comment = ?, 
        doctor_flag = ?, 
        is_reviewed = 1 
       WHERE id = ?`,
      [req.user.id, doctor_comment, doctor_flag, id]
    );

    return sendSuccess(res, {}, 'Screening reviewed successfully');
  } catch (err) {
    next(err);
  }
};

// ─── DOCTOR DASHBOARD STATS ────────────────────────────────────────────────
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [patientCount] = await pool.query("SELECT COUNT(*) as total FROM users WHERE role = 'patient'");
    const [liverCount] = await pool.query("SELECT COUNT(*) as total FROM liver_screenings");
    const [diabetesCount] = await pool.query("SELECT COUNT(*) as total FROM diabetes_screenings");
    
    // High risk cases (Severe or Critical)
    const [highRiskLiver] = await pool.query(
      "SELECT COUNT(*) as total FROM liver_screenings WHERE risk_band IN ('Severe', 'Critical')"
    );
    const [highRiskDiabetes] = await pool.query(
      "SELECT COUNT(*) as total FROM diabetes_screenings WHERE risk_band IN ('Severe', 'Critical')"
    );

    const [recentScreenings] = await pool.query(
      `(SELECT u.full_name, 'liver' as type, s.prediction, s.risk_band, s.created_at 
        FROM liver_screenings s JOIN users u ON s.user_id = u.id)
       UNION ALL
       (SELECT u.full_name, 'diabetes' as type, s.prediction, s.risk_band, s.created_at 
        FROM diabetes_screenings s JOIN users u ON s.user_id = u.id)
       ORDER BY created_at DESC LIMIT 10`
    );

    return sendSuccess(res, {
      counts: {
        patients: patientCount[0].total,
        liverScreenings: liverCount[0].total,
        diabetesScreenings: diabetesCount[0].total,
        highRiskTotal: highRiskLiver[0].total + highRiskDiabetes[0].total
      },
      recentScreenings
    });
  } catch (err) {
    next(err);
  }
};
