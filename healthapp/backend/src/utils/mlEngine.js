const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * METASCALE HEALTH: CENTRALIZED ML EXECUTION KERNEL
 * 
 * This utility provides a zero-config, root-seeking discovery mechanism 
 * to locate the Python virtual environment and the inference scripts.
 */

// Seek the project root by looking for 'venv' or 'healthapp'
const findProjectRoot = (startDir) => {
  let current = startDir;
  while (current !== path.parse(current).root) {
    if (fs.existsSync(path.join(current, 'venv')) || fs.existsSync(path.join(current, 'healthapp'))) {
      return current;
    }
    current = path.dirname(current);
  }
  return startDir; // Fallback to startDir if not found
};

const PROJECT_ROOT = findProjectRoot(__dirname);
const PYTHON_PATH = path.join(PROJECT_ROOT, 'venv/bin/python');
const SCRIPT_PATH = path.join(PROJECT_ROOT, 'healthapp/backend/scripts/inference.py');

/**
 * Executes a machine learning prediction.
 * @param {string} serviceType - 'liver' or 'diabetes'
 * @param {Object} data - Features for inference
 * @returns {Promise<Object>} - Model output
 */
const runInference = (serviceType, data) => {
  return new Promise((resolve, reject) => {
    // 1. Verify environment integrity before execution
    if (!fs.existsSync(PYTHON_PATH)) {
      return reject(new Error(`ML Engine Offline: Python binary not found at ${PYTHON_PATH}`));
    }
    if (!fs.existsSync(SCRIPT_PATH)) {
      return reject(new Error(`Inference Kernel Missing: Script not found at ${SCRIPT_PATH}`));
    }

    // 2. Spawn the process with absolute context
    const inputPayload = JSON.stringify(data);
    
    execFile(PYTHON_PATH, [SCRIPT_PATH, serviceType, inputPayload], (error, stdout, stderr) => {
      // Handle process-level failures (crashes, permission denied)
      if (error) {
        console.error(`[ML_ENGINE][${serviceType.toUpperCase()}] EXEC_ERROR:`, stderr || error.message);
        return reject(new Error(stderr || error.message || 'Inference process crashed.'));
      }

      // 3. Parse and validate kernel output
      try {
        const result = JSON.parse(stdout);
        if (result.status === 'error') {
          return reject(new Error(result.message));
        }
        resolve(result);
      } catch (parseError) {
        console.error(`[ML_ENGINE][${serviceType.toUpperCase()}] PARSE_ERROR:`, stdout);
        reject(new Error('Inference kernel returned malformed telemetry.'));
      }
    });
  });
};

module.exports = { runInference };
