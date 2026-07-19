require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

/**
 * Graceful shutdown handler.
 * Closes the HTTP server cleanly on SIGTERM/SIGINT.
 */
const gracefulShutdown = (server, signal) => {
  console.log(`\n⚡ ${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('✅ HTTP server closed.');
    process.exit(0);
  });

  // Force close after 10 seconds if not done
  setTimeout(() => {
    console.error('❌ Could not close connections in time. Forcing shutdown.');
    process.exit(1);
  }, 10000);
};

/**
 * Bootstrap the application:
 * 1. Connect to MongoDB
 * 2. Start HTTP server
 * 3. Register shutdown handlers
 */
const bootstrap = async () => {
  try {
    // 1. Connect to database
    await connectDB();

    // 2. Start server
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
      console.log(`❤️  Health Check: http://localhost:${PORT}/health\n`);
    });

    // 3. Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`❌ Unhandled Rejection: ${err.message}`);
      gracefulShutdown(server, 'unhandledRejection');
    });

    // 4. Graceful shutdown on signals
    process.on('SIGTERM', () => gracefulShutdown(server, 'SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown(server, 'SIGINT'));

  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

bootstrap();
