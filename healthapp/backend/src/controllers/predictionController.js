const { validationResult } = require('express-validator');
const { pool } = require('../config/db');
const liverSvc = require('../services/liverPredictionService');
const diabetesSvc = require('../services/diabetesPredictionService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ─── LIVER SCREENING SUBMIT ────────────────────────────────────────────────
exports.submitLiver = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 'Validation failed', 422, errors.array());

    const {
      age, gender,
      totalBilirubin, directBilirubin,
      alkalinePhosphotase, alamineAminotransferase, aspartateAminotransferase,
      totalProteins, albumin, albuminGlobulinRatio,
      alcoholPattern, priorLiverDiagnosis, liverTestResult,
    } = req.body;

    const features = {
      age: Number(age),
      gender,
      totalBilirubin: Number(totalBilirubin),
      directBilirubin: Number(directBilirubin),
      alkalinePhosphotase: Number(alkalinePhosphotase),
      alamineAminotransferase: Number(alamineAminotransferase),
      aspartateAminotransferase: Number(aspartateAminotransferase),
      totalProteins: Number(totalProteins),
      albumin: Number(albumin),
      albuminGlobulinRatio: Number(albuminGlobulinRatio),
      alcoholPattern: alcoholPattern || 'none',
      priorLiverDiagnosis: !!priorLiverDiagnosis,
      liverTestResult: liverTestResult || 'notsure',
    };

    const result = liverSvc.predict(features);

    const [dbResult] = await pool.query(
      `INSERT INTO liver_screenings
       (user_id, age, gender, total_bilirubin, direct_bilirubin,
        alkaline_phosphotase, alamine_aminotransferase, aspartate_aminotransferase,
        total_proteins, albumin, albumin_globulin_ratio,
        alcohol_pattern, prior_liver_diagnosis, liver_test_result,
        prediction, confidence, risk_band, interpretation, recommendations)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        req.user.id, features.age, features.gender,
        features.totalBilirubin, features.directBilirubin,
        features.alkalinePhosphotase, features.alamineAminotransferase,
        features.aspartateAminotransferase, features.totalProteins,
        features.albumin, features.albuminGlobulinRatio,
        features.alcoholPattern,
        features.priorLiverDiagnosis ? 1 : 0,
        features.liverTestResult,
        result.prediction, result.confidence, result.riskBand,
        result.interpretation,
        JSON.stringify(result.recommendations),
      ]
    );

    return sendSuccess(
      res,
      { id: dbResult.insertId, ...result, features },
      'Liver screening completed',
      201
    );
  } catch (err) {
    next(err);
  }
};

// ─── DIABETES SCREENING SUBMIT ────────────────────────────────────────────
exports.submitDiabetes = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 'Validation failed', 422, errors.array());

    const {
      ageGroup, gender, familyDiabetes, highBP, physicallyActive, bmi,
      smoking, alcohol, sleepHours, soundSleep, regularMedicine, junkFood,
      stress, bpLevel, pregnancies, prediabetes, urinationFreq,
    } = req.body;

    const features = {
      ageGroup, gender,
      familyDiabetes: !!familyDiabetes,
      highBP: !!highBP,
      physicallyActive: physicallyActive || 'none',
      bmi: Number(bmi) || 22,
      smoking: !!smoking,
      alcohol: !!alcohol,
      sleepHours: Number(sleepHours) || 7,
      soundSleep: Number(soundSleep) || 6,
      regularMedicine: !!regularMedicine,
      junkFood: junkFood || 'rarely',
      stress: stress || 'none',
      bpLevel: bpLevel || 'normal',
      pregnancies: Number(pregnancies) || 0,
      prediabetes: !!prediabetes,
      urinationFreq: urinationFreq || 'notMuch',
    };

    const result = diabetesSvc.predict(features);

    const [dbResult] = await pool.query(
      `INSERT INTO diabetes_screenings
       (user_id, age_group, gender, family_diabetes, high_bp, physically_active,
        bmi, smoking, alcohol, sleep_hours, sound_sleep, regular_medicine,
        junk_food, stress, bp_level, pregnancies, prediabetes, urination_freq,
        prediction, confidence, risk_band, interpretation, recommendations)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        req.user.id, features.ageGroup, features.gender,
        features.familyDiabetes ? 1 : 0, features.highBP ? 1 : 0,
        features.physicallyActive, features.bmi,
        features.smoking ? 1 : 0, features.alcohol ? 1 : 0,
        features.sleepHours, features.soundSleep,
        features.regularMedicine ? 1 : 0, features.junkFood,
        features.stress, features.bpLevel,
        features.pregnancies, features.prediabetes ? 1 : 0,
        features.urinationFreq,
        result.prediction, result.confidence, result.riskBand,
        result.interpretation, JSON.stringify(result.recommendations),
      ]
    );

    return sendSuccess(
      res,
      { id: dbResult.insertId, ...result, features },
      'Diabetes screening completed',
      201
    );
  } catch (err) {
    next(err);
  }
};

// ─── GET PATIENT HISTORY ──────────────────────────────────────────────────
exports.getHistory = async (req, res, next) => {
  try {
    const userId = req.user.role === 'patient' ? req.user.id : req.params.userId;
    const { type } = req.query;

    let liverRows = [], diabetesRows = [];

    if (!type || type === 'liver') {
      [liverRows] = await pool.query(
        `SELECT id, 'liver' AS type, prediction, confidence, risk_band, interpretation,
                recommendations, is_reviewed, doctor_flag, created_at
         FROM liver_screenings WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
      );
    }

    if (!type || type === 'diabetes') {
      [diabetesRows] = await pool.query(
        `SELECT id, 'diabetes' AS type, prediction, confidence, risk_band, interpretation,
                recommendations, is_reviewed, doctor_flag, created_at
         FROM diabetes_screenings WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
      );
    }

    const combined = [...liverRows, ...diabetesRows]
      .map((r) => ({
        ...r,
        recommendations: typeof r.recommendations === 'string' ? JSON.parse(r.recommendations) : r.recommendations,
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return sendSuccess(res, combined);
  } catch (err) {
    next(err);
  }
};

// ─── GET SINGLE SCREENING DETAIL ──────────────────────────────────────────
exports.getScreeningDetail = async (req, res, next) => {
  try {
    const { id, type } = req.params;
    const table = type === 'liver' ? 'liver_screenings' : 'diabetes_screenings';

    const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    if (!rows.length) return sendError(res, 'Screening not found', 404);

    const record = rows[0];
    if (
      req.user.role === 'patient' &&
      record.user_id !== req.user.id
    ) {
      return sendError(res, 'Not authorised', 403);
    }

    if (typeof record.recommendations === 'string') {
      record.recommendations = JSON.parse(record.recommendations);
    }

    return sendSuccess(res, record);
  } catch (err) {
    next(err);
  }
};
