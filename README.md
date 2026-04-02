# Metascale Health 🩺

**Metascale Health** is a premium, full-stack AI-driven health screening platform designed to assess risks for chronic conditions like Liver and Diabetes with clinical accuracy and high-performance UI.

---

## 🚀 Vision
To bridge the gap between complex clinical data and patient understanding through a minimalist, premium "Saffron & Ink" interface and specialized predictive modules.

## ✨ Core Features
- **AI Screening Portal**: High-fidelity modules for Liver and Diabetes assessment.
- **Dynamic Dashboards**: Real-time analytics for both Patients (risk history) and Doctors (patient management).
- **Proactive Consultations**: Integrated scheduling for clinical follow-ups.
- **Privacy First**: Fully secure JWT-based authentication system.

## 🛠️ Technology Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons.
- **Backend**: Node.js, Express.
- **Database**: MySQL.
- **UI/UX**: Custom Design System (22px Architectural Radii).

## 📦 Project Structure
- `healthapp/frontend`: Saffron-themed React application.
- `healthapp/backend`: RESTful API with MySQL integration.
- `notebooks/`: Exploratory Data Analysis and ML logic.
- `literature/`: Clinical research papers supporting the predictive models.

---

## 🔧 Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ishaan-Jain2207/Metascale-Health.git
   ```

2. **Configure Database**:
   Import `healthapp/backend/schema.sql` into your MySQL instance.

3. **Install Dependencies**:
   ```bash
   # Backend
   cd healthapp/backend && npm install
   # Frontend
   cd healthapp/frontend && npm install
   ```

4. **Environment Setup**:
   Create a `.env` in `healthapp/backend` with your `DB_USER`, `DB_PASSWORD`, and `JWT_SECRET`.

5. **Run Development**:
   ```bash
   # Backend
   npm run dev
   # Frontend (in separate terminal)
   npm run dev
   ```

---

## 📄 License
*Private/Internal project for Metascale Health.*
