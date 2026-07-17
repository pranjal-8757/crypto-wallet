const express = require('express');
const sdkController = require('../controllers/sdkController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Reserved for the Visual Password SDK's challenge lifecycle.
// Not implemented in this phase -- see controllers/sdkController.js.
router.post('/challenge/start', protect, sdkController.startChallenge);
router.post('/challenge/verify', protect, sdkController.verifyChallenge);
router.post('/challenge/cancel', protect, sdkController.cancelChallenge);

module.exports = router;
