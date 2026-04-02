const app = require('./app');
const { testConnection } = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Database check
    await testConnection();
    
    // Server start
    app.listen(PORT, () => {
      console.log(`🚀  Metascale Health Server started on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
    });
  } catch (err) {
    console.error('❌  Error starting server:', err.message);
    process.exit(1);
  }
};

startServer();
