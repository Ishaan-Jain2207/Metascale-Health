const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();

// Required for express-rate-limit to work behind Railway's proxy
app.set('trust proxy', 1);

// Middleware
app.use(helmet());

// Hardened CORS for Production
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL?.replace(/\/$/, ""), // Allow without trailing slash
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps)
    if (!origin) return callback(null, true);
    
    // In development mode, allow any local IP (essential for mobile device testing)
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev && (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://192.168.') || origin.startsWith('http://172.') || origin.startsWith('http://10.'))) {
       return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) === -1) {
      console.log(`CORS Blocked: Origin ${origin} not in allowed list:`, allowedOrigins);
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictionRoutes); // Using prediction logic here
app.use('/api/doctor', doctorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes);

// Root
app.get('/', (req, res) => {
  res.send('Metascale Health API is running...');
});

// Error Handling
app.use(errorHandler);

module.exports = app;
