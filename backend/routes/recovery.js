const express = require('express');
const recoveryController = require('../controllers/recoveryController');
const { requireFields, validateEmail } = require('../utils/validation');

const router = express.Router();

// No `protect` middleware -- recovery exists precisely for users who
// can no longer authenticate normally.
router.post('/start', requireFields(['email']), validateEmail, recoveryController.startRecovery);
router.post('/verify-email', requireFields(['recoveryId', 'otp']), recoveryController.verifyEmail);

module.exports = router;
