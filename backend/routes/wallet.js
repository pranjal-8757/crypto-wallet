const express = require('express');
const walletController = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, walletController.getWallet);
router.post('/', protect, walletController.saveWallet);
router.get('/balance', protect, walletController.getBalance);

module.exports = router;

