const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ─── BOOK APPOINTMENT ──────────────────────────────────────────────────
exports.bookAppointment = async (req, res, next) => {
  try {
    const { doctor_id, appt_date, appt_time, reason, type } = req.body;

    const [result] = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, appt_date, appt_time, reason, type, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [req.user.id, doctor_id, appt_date, appt_time, reason, type || 'in-person']
    );

    return sendSuccess(res, { id: result.insertId }, 'Appointment booked successfully', 201);
  } catch (err) {
    next(err);
  }
};

// ─── GET PATIENT APPOINTMENTS ──────────────────────────────────────────
exports.getPatientAppointments = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, d.full_name as doctor_name, d.specialization 
       FROM appointments a 
       JOIN users d ON a.doctor_id = d.id 
       WHERE a.patient_id = ? ORDER BY a.appt_date DESC, a.appt_time DESC`,
      [req.user.id]
    );
    return sendSuccess(res, rows);
  } catch (err) {
    next(err);
  }
};

// ─── GET DOCTOR APPOINTMENTS ───────────────────────────────────────────
exports.getDoctorAppointments = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, p.full_name as patient_name, p.age, p.gender 
       FROM appointments a 
       JOIN users p ON a.patient_id = p.id 
       WHERE a.doctor_id = ? ORDER BY a.appt_date DESC, a.appt_time DESC`,
      [req.user.id]
    );
    return sendSuccess(res, rows);
  } catch (err) {
    next(err);
  }
};

// ─── UPDATE APPOINTMENT STATUS ─────────────────────────────────────────
exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, doctor_notes } = req.body;

    await pool.query(
      `UPDATE appointments SET status = ?, doctor_notes = COALESCE(?, doctor_notes) WHERE id = ?`,
      [status, doctor_notes, id]
    );

    return sendSuccess(res, {}, 'Appointment status updated');
  } catch (err) {
    next(err);
  }
};
