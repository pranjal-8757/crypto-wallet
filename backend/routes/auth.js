const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();
const credentialShape = [
  body().custom((value) => {
    const passwordFlow = typeof value.password === 'string';
    const turnkeyFlow = typeof value.turnkeyUserId === 'string' && typeof value.organizationId === 'string';
    if (!passwordFlow && !turnkeyFlow) throw new Error('Provide email and password, or turnkeyUserId and organizationId.');
    return true;
  }),
];
router.post('/register', credentialShape, validateRequest, authController.register);
router.post('/login', credentialShape, validateRequest, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.getCurrentUser);
module.exports = router;
    
