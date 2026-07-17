const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { requireFields } = require('../utils/validation');

const router = express.Router();

// `turnkeyUserId` and `organizationId` come from the active Wallet Kit
// session after handleLogin() succeeds. Email is NOT required here --
// per Turnkey's own user model, email is just one of several optional
// auth methods (passkey, phone, OAuth) and many users will have none.
router.post('/register', requireFields([
    "turnkeyUserId",
    "organizationId",
]), authController.register);
router.post('/login', requireFields([
    "turnkeyUserId",
    "organizationId",
]), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.getCurrentUser);

module.exports = router;
    