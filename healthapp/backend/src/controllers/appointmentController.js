const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ─── BOOK APPOINTMENT ──────────────────────────────────────────────────
exports.bookAppointment = async (req, res, next) => {
  try {
    const { doctor_id, appt_date, appt_time, reason, type } = req.body;
    const patient_id = req.user.id;

    // 1. Check for Double Booking
    const [existing] = await pool.query(
      "SELECT id FROM appointments WHERE doctor_id = ? AND appt_date = ? AND appt_time = ? AND status != 'cancelled'",
      [doctor_id, appt_date, appt_time]
    );

    if (existing.length > 0) {
      return sendError(res, 'This clinical slot is already reserved. Please select another time.', 409);
    }

    const [result] = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, appt_date, appt_time, reason, type, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [patient_id, doctor_id, appt_date, appt_time, reason, type || 'in-person']
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

// ─── CANCEL APPOINTMENT (PATIENT) ──────────────────────────────────────
exports.cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient_id = req.user.id;

    const [appt] = await pool.query("SELECT * FROM appointments WHERE id = ? AND patient_id = ?", [id, patient_id]);
    if (!appt.length) return sendError(res, 'Appointment not found or unauthorized', 404);

    await pool.query("UPDATE appointments SET status = 'cancelled' WHERE id = ?", [id]);
    return sendSuccess(res, {}, 'Appointment cancelled successfully');
  } catch (err) {
    next(err);
  }
};
