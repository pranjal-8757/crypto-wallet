const express = require('express');
const transactionController = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const { validateTransaction } = require('../utils/validation');

const router = express.Router();

router.post('/', protect, validateTransaction, transactionController.prepareTransaction);
router.get('/', protect, transactionController.listTransactions);
router.post('/:id/finalize', protect, transactionController.finalizeTransaction);
router.get('/:id', protect, transactionController.getTransaction);

module.exports = router;
