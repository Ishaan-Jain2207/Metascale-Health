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
    // Total patients who have booked with this doctor or whose screening this doctor reviewed
    const [patientCount] = await pool.query(
      `SELECT COUNT(DISTINCT patient_id) as total FROM (
         SELECT patient_id FROM appointments WHERE doctor_id = ?
         UNION
         SELECT user_id as patient_id FROM liver_screenings WHERE doctor_id = ?
         UNION
         SELECT user_id as patient_id FROM diabetes_screenings WHERE doctor_id = ?
       ) as dr_patients`,
      [req.user.id, req.user.id, req.user.id]
    );

    // Pending reviews (Patients with appointments or explicitly assigned screenings not yet reviewed)
    const [pendingLiver] = await pool.query(
      "SELECT COUNT(*) as total FROM liver_screenings WHERE is_reviewed = 0 AND doctor_id = ?",
      [req.user.id]
    );
    const [pendingDiabetes] = await pool.query(
      "SELECT COUNT(*) as total FROM diabetes_screenings WHERE is_reviewed = 0 AND doctor_id = ?",
      [req.user.id]
    );

    // Recent screenings for this doctor's patients
    const [recentScreenings] = await pool.query(
      `(SELECT u.full_name, u.age, u.gender, 'liver' as type, s.prediction, s.risk_band, s.created_at, s.user_id as patient_id
        FROM liver_screenings s JOIN users u ON s.user_id = u.id 
        WHERE s.doctor_id = ? OR s.user_id IN (SELECT patient_id FROM appointments WHERE doctor_id = ?))
       UNION ALL
       (SELECT u.full_name, u.age, u.gender, 'diabetes' as type, s.prediction, s.risk_band, s.created_at, s.user_id as patient_id
        FROM diabetes_screenings s JOIN users u ON s.user_id = u.id 
        WHERE s.doctor_id = ? OR s.user_id IN (SELECT patient_id FROM appointments WHERE doctor_id = ?))
       ORDER BY created_at DESC LIMIT 10`,
      [req.user.id, req.user.id, req.user.id, req.user.id]
    );

    return sendSuccess(res, {
      totalPatients: patientCount[0].total,
      pendingReviews: pendingLiver[0].total + pendingDiabetes[0].total,
      recentScreenings
    });
  } catch (err) {
    next(err);
  }
};
