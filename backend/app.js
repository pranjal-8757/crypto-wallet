const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const walletRoutes = require('./routes/wallet');
const transactionRoutes = require('./routes/transaction');
const recoveryRoutes = require('./routes/recovery');
const sdkRoutes = require('./routes/sdk');
const visualPasswordRoutes = require('./routes/visualPassswordRoutes');
const settingsRoutes = require('./routes/settings');
const rateLimit = require('./middleware/rateLimit');

const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// --------------------------------------------------------------
// Security & parsing middleware
// --------------------------------------------------------------
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('trust proxy', 1);
app.use('/api', rateLimit());

app.use(
  morgan('dev', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// --------------------------------------------------------------
// Health check
// --------------------------------------------------------------
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Backend is running' });
});

// --------------------------------------------------------------
// Route registration
//
// Frontend -> Backend -> Turnkey -> Blockchain
// (Visual Password SDK will sit between Backend and Turnkey once
// integrated -- see routes/sdk.js for its reserved plug-in point.)
// --------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/history', transactionRoutes);
app.use('/api/recovery', recoveryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/sdk', sdkRoutes);
app.use('/v1', visualPasswordRoutes);

// --------------------------------------------------------------
// 404 + centralized error handling (must be registered last)
// --------------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
