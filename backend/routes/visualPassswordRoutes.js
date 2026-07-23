const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/visualPasswordController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();
router.use(protect);
router.post('/setup', [
  body('secretWord').isString().trim().isLength({ min: 3, max: 128 }),
  body('offset').isInt({ min: 10, max: 99 }),
  body('positionKeys').isArray({ min: 2, max: 2 }),
], validateRequest, controller.setup);
router.get('/setup', controller.getSetupStatus);
router.post('/challenge/start', controller.createChallenge);
router.post('/challenge/verify', [
  body('challengeId').isUUID(),
  body('visualPasswordRegister').isObject(),
  body('amount').isString(),
  body('recipientRegister').isObject(),
], validateRequest, controller.verifyChallenge);

module.exports = router;
