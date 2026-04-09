const app = require('./app');
const { testConnection } = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Database check
    await testConnection();

    // Server start - explicitly listen on 0.0.0.0 to allow network-wide access
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀  Metascale Health Server started on all interfaces (0.0.0.0) at port ${PORT}`);
    });
  } catch (err) {
    console.error('❌  Error starting server:', err.message);
    process.exit(1);
  }
};

startServer();
