# Metascale Health

A web-based health screening platform that uses trained machine learning models to assess a person's risk for **Liver Disease** and **Type 2 Diabetes**. Patients fill out a simple form, and the system instantly tells them their risk level along with clear recommendations. Doctors can review the results and flag urgent cases. Admins manage the whole platform.

---

## What Does This Project Do?

Metascale Health works like a digital health check-up. Instead of visiting a hospital for initial screening, a user can:

1. **Enter their health data** (blood test values for liver, or lifestyle answers for diabetes)
2. **Get an instant risk assessment** powered by a trained Random Forest ML model
3. **Read a plain-English explanation** of what the result means
4. **See actionable recommendations** (e.g. "consult a hepatologist", "monitor blood glucose")
5. **Book an appointment** with a verified doctor if needed

The prediction is not a medical diagnosis. It is a risk indicator that helps people know whether they should see a doctor.

---

## How the ML Prediction Works

This is the core of the project. Here is what happens when a patient submits a screening form:

```
Patient fills form (React) 
    --> Sends data to backend (Node.js/Express)
        --> Backend calls Python via child process (mlEngine.js)
            --> Python loads trained .pkl model (inference.py)
                --> Model returns probability of disease
            --> Backend converts probability to risk level
        --> Result saved to MySQL database
    --> Patient sees result on screen
```

**The ML models:**
- `liver_model.pkl` - A Random Forest classifier (150 trees, max depth 7) trained on the Indian Liver Patient Dataset (583 records from UCI repository)
- `diabetes_model.pkl` - A Random Forest classifier (100 trees) trained on a diabetes lifestyle dataset from BIT Mesra, India

**Zero-Failure Protocol:** If Python or the ML models are unavailable (e.g. missing dependency in deployment), the system silently falls back to a simplified rule-based scoring method. The patient always gets a result, no matter what.

---

## Three User Roles

### Patient
- Fill out liver or diabetes screening forms
- View risk results with interpretation and recommendations
- See full screening history
- Book appointments with doctors (in-person, video, or phone)
- Manage health profile (blood group, medications, medical history)

### Doctor
- View list of assigned patients
- Review patient screening results in detail
- Add clinical comments and flag cases as normal / watch / urgent
- Manage appointment schedule and add doctor notes

### Admin
- Approve or reject new doctor registrations
- View platform-wide analytics (total users, screenings, risk distribution)
- Activate or deactivate any user account

---

## Tech Stack

| Layer | Technology | What It Does |
|-------|-----------|--------------|
| Frontend | React 19, Vite, Tailwind CSS 4 | The website the user sees and interacts with |
| Backend | Node.js, Express | Handles all API requests, authentication, and business logic |
| Database | MySQL | Stores user accounts, screening results, appointments |
| ML Models | Python, scikit-learn, pandas, joblib | Trained Random Forest models saved as .pkl files |
| ML Bridge | mlEngine.js + inference.py | Node.js spawns a Python child process to run predictions |
| Auth | JWT + bcryptjs | Secure login with encrypted passwords and token-based sessions |
| Security | Helmet, CORS, rate limiting, express-validator | Protects against common web attacks |
| Deployment | Vercel (frontend), Railway (backend + MySQL) | Cloud hosting |

---

## Project Structure

```
Metascale-Health/
  README.md
  requirements.txt                    # Python dependencies for ML

  notebooks/                          # Jupyter notebooks (data science work)
    liver_dataset_cleaning.ipynb      #   Cleans the raw liver dataset
    diabetes_dataset_logic.ipynb      #   Cleans the raw diabetes dataset
    analysis_both.ipynb               #   Trains both models and exports .pkl files

  healthapp/
    backend/
      scripts/
        inference.py                  # Python script that loads models and makes predictions
        models/
          liver_model.pkl             # Trained liver disease Random Forest model
          diabetes_model.pkl          # Trained diabetes Random Forest model
      src/
        server.js                     # Entry point - starts the HTTP server
        app.js                        # Express app with all middleware and routes
        config/
          db.js                       # MySQL connection pool setup
        controllers/
          authController.js           # Login, register, profile management
          predictionController.js     # Handles screening submissions
          doctorController.js         # Doctor-specific actions
          adminController.js          # Admin-specific actions
          appointmentController.js    # Appointment booking and management
        services/
          liverPredictionService.js   # Liver ML prediction + fallback logic
          diabetesPredictionService.js # Diabetes ML prediction + fallback logic
          geminiService.js            # Optional AI text generation (Google Gemini)
        utils/
          mlEngine.js                 # Bridges Node.js to Python (spawns child process)
          jwtHelper.js                # JWT token generation and verification
          apiResponse.js              # Standardised API response format
          migrate.js                  # Auto-migration on server boot
        middleware/
          auth.js                     # JWT authentication middleware
          roleAuth.js                 # Role-based access control (patient/doctor/admin)
          errorHandler.js             # Global error handler
        routes/
          authRoutes.js               # /api/auth/* endpoints
          predictionRoutes.js         # /api/predict/* endpoints
          doctorRoutes.js             # /api/doctor/* endpoints
          adminRoutes.js              # /api/admin/* endpoints
          appointmentRoutes.js        # /api/appointments/* endpoints
      schema.sql                      # Full database schema (5 tables)
      .env                            # Environment variables (not committed)

    frontend/
      src/
        main.jsx                      # React entry point
        App.jsx                       # Routes and lazy loading
        context/
          AuthContext.jsx             # Login state shared across the app
        services/
          api.js                      # Axios client with JWT interceptor
          HealthService.js            # Screening and history API calls
        pages/                        # All page components (patient, doctor, admin views)
        components/                   # Shared UI components (layout, sidebar, etc.)
```

---

## Database Tables

The MySQL database has **5 tables** (auto-created on server boot via `migrate.js`):

| Table | What It Stores |
|-------|---------------|
| `users` | All accounts (patients, doctors, admins) with profile data, medical history flags, and doctor credentials |
| `liver_screenings` | Every liver screening: input biomarkers + ML prediction + doctor review |
| `diabetes_screenings` | Every diabetes screening: lifestyle answers + ML prediction + doctor review |
| `appointments` | Scheduled consultations between patients and doctors |
| `notifications` | System alerts and messages for users |

---

## API Endpoints (24 total)

### Auth (`/api/auth`)
| Method | Endpoint | What It Does |
|--------|----------|-------------|
| POST | `/register` | Create a new patient or doctor account |
| POST | `/login` | Log in and get a JWT token |
| GET | `/me` | Get your own profile data |
| PUT | `/profile` | Update your profile |
| PUT | `/change-password` | Change your password |
| GET | `/doctors` | List all approved doctors |

### Predictions (`/api/predict`)
| Method | Endpoint | What It Does |
|--------|----------|-------------|
| POST | `/liver` | Submit a liver screening (runs ML model) |
| POST | `/diabetes` | Submit a diabetes screening (runs ML model) |
| GET | `/history` | Get your past screening results |
| GET | `/detail/:type/:id` | Get full details of one screening |

### Doctor (`/api/doctor`)
| Method | Endpoint | What It Does |
|--------|----------|-------------|
| GET | `/patients` | List your assigned patients |
| GET | `/patients/:id` | View one patient's details |
| GET | `/patients/:id/history` | View a patient's screening history |
| PUT | `/screenings/:type/:id/review` | Add a review comment to a screening |
| GET | `/stats` | Get your dashboard statistics |

### Admin (`/api/admin`)
| Method | Endpoint | What It Does |
|--------|----------|-------------|
| GET | `/analytics` | Platform-wide stats and charts |
| GET | `/doctors` | List all doctors with approval status |
| PUT | `/doctors/:id/approve` | Approve a new doctor |
| PUT | `/users/:id/status` | Activate or deactivate a user |

### Appointments (`/api/appointments`)
| Method | Endpoint | What It Does |
|--------|----------|-------------|
| POST | `/` | Book a new appointment |
| GET | `/` | List your appointments |
| PUT | `/:id/status` | Change appointment status |
| PUT | `/:id/notes` | Add doctor notes |
| DELETE | `/:id` | Cancel an appointment |

---

## Local Setup

### Prerequisites
- **Node.js** 18 or higher
- **Python** 3.8 or higher
- **MySQL** 8.x running locally or remotely

### 1. Clone the Repository

```bash
git clone https://github.com/Ishaan-Jain2207/Metascale-Health.git
cd Metascale-Health
```

### 2. Set Up the Database

Import the schema into your MySQL instance:

```bash
mysql -u root -p < healthapp/backend/schema.sql
```

This creates all 5 tables and a default admin account (`admin@metascale.health` / `Admin@1234`).

### 3. Configure Environment Variables

Create a `.env` file inside `healthapp/backend/`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=metascale_health
JWT_SECRET=any_random_secret_string
```

### 4. Install Python Dependencies (for ML models)

```bash
pip install scikit-learn pandas joblib numpy
```

These are needed by `inference.py` to load and run the trained models.

### 5. Start the Backend

```bash
cd healthapp/backend
npm install
npm run dev
```

The server starts on `http://localhost:5000`. On boot, it automatically checks the database schema and adds any missing columns.

### 6. Start the Frontend

Open a new terminal:

```bash
cd healthapp/frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5173`.

### 7. Open the App

Go to `http://localhost:5173` in your browser. You can:
- Register as a patient and submit a screening
- Log in as admin (`admin@metascale.health` / `Admin@1234`) to manage doctors

---

## Security

The platform uses multiple layers of protection:

- **Passwords** are hashed with bcrypt (12 salt rounds) - they cannot be reversed even if the database is stolen
- **JWT tokens** expire after 7 days and are verified against the database on every request
- **Role-based access** ensures patients, doctors, and admins can only access their own data
- **Helmet** adds 15+ security HTTP headers automatically
- **CORS** only allows requests from the frontend domain
- **Rate limiting** blocks IPs that send more than 100 requests in 15 minutes
- **Input validation** checks all incoming data before processing

---

## Notebooks (Data Science)

The `notebooks/` folder contains the Jupyter notebooks used to clean the datasets and train the models:

| Notebook | Purpose |
|----------|---------|
| `liver_dataset_cleaning.ipynb` | Cleans the raw ILPD dataset: adds column headers, encodes gender, fixes target labels, fills missing values |
| `diabetes_dataset_logic.ipynb` | Cleans the diabetes dataset: fixes typos, encodes categorical values, handles missing data |
| `analysis_both.ipynb` | Trains both Random Forest models, generates accuracy scores, feature importance charts, confusion matrices, and exports the .pkl files |

---

## Deployment

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend | Vercel | Automatic deploys from `main` branch |
| Backend + DB | Railway | Node.js service with managed MySQL |

The backend auto-detects Python and the inference script path at startup, so it works in both local and cloud environments without configuration changes.

---

## License

Private / Internal project for Metascale Health.
