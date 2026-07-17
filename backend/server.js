require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

/**
 * Boots the backend: connect to MongoDB first, then start accepting
 * HTTP traffic. Fails fast (exits) if the database is unreachable,
 * rather than serving requests it can't fulfill.
 */
async function start() {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    });

    const shutdown = (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
}

start();
