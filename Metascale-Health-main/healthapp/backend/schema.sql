-- ──────────────────────────────────────────
-- USERS (patients + doctors)
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(120) NOT NULL,
  email         VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('patient','doctor','admin') NOT NULL DEFAULT 'patient',
  age           INT,
  gender        ENUM('male','female','other') DEFAULT NULL,
  phone         VARCHAR(20)  DEFAULT '',
  blood_group   VARCHAR(10)  DEFAULT '',
  address       TEXT,
  -- medical background (patients)
  has_hypertension         TINYINT(1) DEFAULT 0,
  has_diabetes             TINYINT(1) DEFAULT 0,
  has_liver_condition      TINYINT(1) DEFAULT 0,
  family_history_diabetes  TINYINT(1) DEFAULT 0,
  current_medications      TEXT,
  -- doctor-specific
  specialization   VARCHAR(120) DEFAULT '',
  hospital         VARCHAR(180) DEFAULT '',
  license_number   VARCHAR(80)  DEFAULT '',
  is_approved      TINYINT(1)  DEFAULT 1,
  -- common
  is_active   TINYINT(1) DEFAULT 1,
  last_login  DATETIME   DEFAULT NULL,
  created_at  DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────
-- LIVER SCREENINGS
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS liver_screenings (
  id                          INT AUTO_INCREMENT PRIMARY KEY,
  user_id                     INT NOT NULL,
  age                         INT,
  gender                      VARCHAR(10),
  total_bilirubin             DECIMAL(8,3),
  direct_bilirubin            DECIMAL(8,3),
  alkaline_phosphotase        DECIMAL(10,2),
  alamine_aminotransferase    DECIMAL(10,2),
  aspartate_aminotransferase  DECIMAL(10,2),
  total_proteins              DECIMAL(8,3),
  albumin                     DECIMAL(8,3),
  albumin_globulin_ratio      DECIMAL(8,3),
  alcohol_pattern             VARCHAR(30),
  prior_liver_diagnosis       TINYINT(1) DEFAULT 0,
  liver_test_result           VARCHAR(30),
  -- prediction output
  prediction       VARCHAR(30),
  confidence       DECIMAL(5,4),
  risk_band        VARCHAR(30),
  interpretation   TEXT,
  recommendations  TEXT,
  -- doctor review
  doctor_id        INT DEFAULT NULL,
  doctor_comment   TEXT,
  doctor_flag      ENUM('normal','watch','urgent','') DEFAULT '',
  is_reviewed      TINYINT(1) DEFAULT 0,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ──────────────────────────────────────────
-- DIABETES SCREENINGS
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS diabetes_screenings (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  user_id             INT NOT NULL,
  age_group           VARCHAR(20),
  gender              VARCHAR(10),
  family_diabetes     TINYINT(1) DEFAULT 0,
  high_bp             TINYINT(1) DEFAULT 0,
  physically_active   VARCHAR(20),
  bmi                 DECIMAL(6,2),
  smoking             TINYINT(1) DEFAULT 0,
  alcohol             TINYINT(1) DEFAULT 0,
  sleep_hours         DECIMAL(4,1),
  sound_sleep         DECIMAL(4,1),
  regular_medicine    TINYINT(1) DEFAULT 0,
  junk_food           VARCHAR(20),
  stress              VARCHAR(20),
  bp_level            VARCHAR(20),
  pregnancies         INT DEFAULT 0,
  prediabetes         TINYINT(1) DEFAULT 0,
  urination_freq      VARCHAR(20),
  -- prediction output
  prediction       VARCHAR(30),
  confidence       DECIMAL(5,4),
  risk_band        VARCHAR(30),
  interpretation   TEXT,
  recommendations  TEXT,
  -- doctor review
  doctor_id        INT DEFAULT NULL,
  doctor_comment   TEXT,
  doctor_flag      ENUM('normal','watch','urgent','') DEFAULT '',
  is_reviewed      TINYINT(1) DEFAULT 0,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ──────────────────────────────────────────
-- APPOINTMENTS
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  patient_id    INT NOT NULL,
  doctor_id     INT NOT NULL,
  appt_date     DATE NOT NULL,
  appt_time     VARCHAR(20) NOT NULL,
  reason        TEXT,
  type          ENUM('in-person','video','phone') DEFAULT 'in-person',
  status        ENUM('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  notes         TEXT,
  doctor_notes  TEXT,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id)  REFERENCES users(id) ON DELETE CASCADE
);

-- ──────────────────────────────────────────
-- NOTIFICATIONS
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  title       VARCHAR(255) NOT NULL,
  message     TEXT NOT NULL,
  type        ENUM('info','warning','success','alert') DEFAULT 'info',
  is_read     TINYINT(1) DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ──────────────────────────────────────────
-- SEED DATA
-- ──────────────────────────────────────────
-- Default admin: admin@metascale.health / Admin@1234
INSERT IGNORE INTO users (full_name, email, password_hash, role, is_approved)
VALUES ('Admin', 'admin@metascale.health',
  '$2a$12$Bv5hC3UxoVjL1SQvVe0hJe6lI.4TDo8Xv4zWYN4sLs8C3EqNlSM6m',
  'admin', 1);

-- Default doctor: doctor@metascale.health / Doctor@1234
INSERT IGNORE INTO users (full_name, email, password_hash, role, specialization, hospital, is_approved)
VALUES ('Dr. Priya Sharma', 'doctor@metascale.health',
  '$2a$12$WXyLuCozg.NXlHk7w8Db0.pF/nKSPy3dHAmJlXERzCZ.A5JI7YWxm',
  'doctor', 'Hepatology & Endocrinology', 'AIIMS Delhi', 1);
