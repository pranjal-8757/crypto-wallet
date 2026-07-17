/**
 * utils/logger.js
 *
 * Small dependency-free logger. Swap the transport (e.g. to Winston
 * or Pino) later without touching call sites elsewhere in the app.
 */

const LEVELS = {
  info: '\x1b[36mINFO\x1b[0m',
  warn: '\x1b[33mWARN\x1b[0m',
  error: '\x1b[31mERROR\x1b[0m',
  debug: '\x1b[90mDEBUG\x1b[0m',
};

function write(level, message) {
  const timestamp = new Date().toISOString();
  const label = LEVELS[level] || level.toUpperCase();
  // eslint-disable-next-line no-console
  console.log(`[${timestamp}] ${label} ${message}`);
}

const logger = {
  info: (message) => write('info', message),
  warn: (message) => write('warn', message),
  error: (message) => write('error', message),
  debug: (message) => {
    if (process.env.NODE_ENV !== 'production') write('debug', message);
  },
};

module.exports = logger;
