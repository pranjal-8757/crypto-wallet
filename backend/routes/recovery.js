const express = require('express');
const recoveryController = require('../controllers/recoveryController');
const { requireFields, validateEmail } = require('../utils/validation');

const router = express.Router();

// No `protect` middleware -- recovery exists precisely for users who
// can no longer authenticate normally.
router.post('/start', requireFields(['email']), validateEmail, recoveryController.startRecovery);
router.post('/verify-email', requireFields(['recoveryId', 'otp']), recoveryController.verifyEmail);
router.post('/challenge/start', requireFields(['recoveryId']), recoveryController.startVisualPasswordChallenge);
router.post('/verify-visual-password', requireFields(['recoveryId', 'verificationPayload']), recoveryController.verifyVisualPassword);

module.exports = router;
