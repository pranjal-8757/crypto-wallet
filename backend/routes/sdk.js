const express = require('express');
const sdkController = require('../controllers/sdkController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// Reserved for the Visual Password SDK's challenge lifecycle.
// Not implemented in this phase -- see controllers/sdkController.js.
router.post('/challenge/start', protect, [body('recipient').isString().trim().notEmpty(), body('amount').isString().trim().notEmpty(), body('network').isString().trim().notEmpty()], validateRequest, sdkController.startChallenge);
router.post('/challenge/verify', protect, [body('challengeId').isUUID(), body('visualPasswordRegister').isObject(), body('amount').isString().trim().notEmpty(), body('recipientRegister').isObject()], validateRequest, sdkController.verifyChallenge);
router.post('/challenge/cancel', protect, sdkController.cancelChallenge);

module.exports = router;
