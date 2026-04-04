const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { pool } = require('../config/db');
const generateToken = require('../utils/generateToken');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ─── USER REGISTER (Patient / Doctor) ──────────────────────────────────────
exports.registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed', 422, errors.array());
    }

    const { 
      full_name, email, password, age, gender, phone, role, 
      specialization, hospital, license_number, 
      medical_council, years_of_experience, qualification 
    } = req.body;
    
    // Validate role (whitelist only patient and doctor for public registration)
    const validRoles = ['patient', 'doctor'];
    const assignedRole = validRoles.includes(role) ? role : 'patient';

    // Check duplicate
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return sendError(res, 'Email already registered', 409);

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      `INSERT INTO users (
        full_name, email, password_hash, role, age, gender, phone, 
        specialization, hospital, license_number, medical_council, 
        years_of_experience, qualification, is_approved
      )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name, email, hash, assignedRole, age || null, gender || null, phone || '', 
        specialization || '', hospital || '', license_number || '', 
        medical_council || '', years_of_experience || 0, qualification || '',
        assignedRole === 'doctor' ? 1 : 0
      ]
    );

    const token = generateToken({ id: result.insertId, role: assignedRole });

    return sendSuccess(
      res,
      { token, user: { id: result.insertId, full_name, email, role: assignedRole, age, gender } },
      'Account created successfully',
      201
    );
  } catch (err) {
    next(err);
  }
};

// ─── GET SPECIALISTS (Public/Patient Discovery) ──────────────────────────
exports.getDoctors = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, full_name, specialization, hospital FROM users WHERE role = 'doctor' AND is_approved = 1 AND is_active = 1"
    );
    return sendSuccess(res, rows);
  } catch (err) {
    next(err);
  }
};

// ─── PATIENT / DOCTOR / ADMIN LOGIN ───────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed', 422, errors.array());
    }

    const { email, password } = req.body;

    const [rows] = await pool.query(
      'SELECT id, full_name, email, password_hash, role, is_active, age, gender, phone FROM users WHERE email = ?',
      [email]
    );

    if (!rows.length) return sendError(res, 'Invalid credentials', 401);

    const user = rows[0];
    if (!user.is_active) return sendError(res, 'Account has been deactivated', 401);

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return sendError(res, 'Invalid credentials', 401);

    // Update last_login
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    const token = generateToken({ id: user.id, role: user.role });
    const { password_hash, ...safeUser } = user;

    return sendSuccess(res, { token, user: safeUser }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

// ─── GET CURRENT USER PROFILE ─────────────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, full_name, email, role, age, gender, phone, blood_group, address,
              has_hypertension, has_diabetes, has_liver_condition, family_history_diabetes,
              current_medications, specialization, hospital, created_at
       FROM users WHERE id = ?`,
      [req.user.id]
    );
    if (!rows.length) return sendError(res, 'User not found', 404);
    return sendSuccess(res, rows[0]);
  } catch (err) {
    next(err);
  }
};

// ─── UPDATE PROFILE ───────────────────────────────────────────────────────
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      full_name, age, gender, phone, blood_group, address,
      has_hypertension, has_diabetes, has_liver_condition,
      family_history_diabetes, current_medications,
      specialization, hospital, license_number, medical_council,
      years_of_experience, qualification
    } = req.body;

    await pool.query(
      `UPDATE users SET
        full_name = COALESCE(?, full_name),
        age = COALESCE(?, age),
        gender = COALESCE(?, gender),
        phone = COALESCE(?, phone),
        blood_group = COALESCE(?, blood_group),
        address = COALESCE(?, address),
        has_hypertension = COALESCE(?, has_hypertension),
        has_diabetes = COALESCE(?, has_diabetes),
        has_liver_condition = COALESCE(?, has_liver_condition),
        family_history_diabetes = COALESCE(?, family_history_diabetes),
        current_medications = COALESCE(?, current_medications),
        specialization = COALESCE(?, specialization),
        hospital = COALESCE(?, hospital),
        license_number = COALESCE(?, license_number),
        medical_council = COALESCE(?, medical_council),
        years_of_experience = COALESCE(?, years_of_experience),
        qualification = COALESCE(?, qualification)
       WHERE id = ?`,
      [
        full_name, age, gender, phone, blood_group, address,
        has_hypertension != null ? (has_hypertension ? 1 : 0) : null,
        has_diabetes != null ? (has_diabetes ? 1 : 0) : null,
        has_liver_condition != null ? (has_liver_condition ? 1 : 0) : null,
        family_history_diabetes != null ? (family_history_diabetes ? 1 : 0) : null,
        current_medications,
        specialization,
        hospital,
        license_number,
        medical_council,
        years_of_experience,
        qualification,
        req.user.id,
      ]
    );

    const [rows] = await pool.query(
      'SELECT id, full_name, email, role, age, gender, phone, blood_group, address FROM users WHERE id = ?',
      [req.user.id]
    );
    return sendSuccess(res, rows[0], 'Profile updated');
  } catch (err) {
    next(err);
  }
};

// ─── CHANGE PASSWORD ──────────────────────────────────────────────────────
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const [rows] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    if (!rows.length) return sendError(res, 'User not found', 404);

    const match = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!match) return sendError(res, 'Current password is incorrect', 400);

    const salt = await bcrypt.genSalt(12);
    const newHash = await bcrypt.hash(newPassword, salt);
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, req.user.id]);

    return sendSuccess(res, {}, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
};
