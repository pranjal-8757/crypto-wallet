const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Connects to MongoDB using the URI in process.env.MONGO_URI.
 *
 * Called once from server.js before the HTTP server starts listening,
 * so the process fails fast if the database is unreachable rather
 * than accepting traffic it can't serve.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not set. Copy .env.example to .env and configure it.');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri);

  logger.info(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);

  mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });
}

module.exports = connectDB;
