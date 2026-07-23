const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const { validateTransaction } = require('../utils/validation');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();
const transactionId = body('transactionId').isString().trim().notEmpty();

router.post('/start', protect, validateTransaction, controller.start);
router.post('/verify-amount', protect, [transactionId, body('amountCode').isString().matches(/^\d{5}$/)], validateRequest, controller.verifyAmount);
router.post('/verify-recipient', protect, [transactionId, body('recipientCode').isString().trim().isLength({ min: 2, max: 2 })], validateRequest, controller.verifyRecipient);
router.post('/complete', protect, [transactionId, body('verificationToken').isString().trim().notEmpty()], validateRequest, controller.complete);

// Existing wallet transaction API is preserved.
router.post('/', protect, validateTransaction, controller.prepareTransaction);
router.get('/', protect, controller.listTransactions);
router.post('/:id/finalize', protect, controller.finalizeTransaction);
router.get('/:id', protect, controller.getTransaction);
module.exports = router;


/*const express = require('express');
const transactionController = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const { validateTransaction } = require('../utils/validation');

const router = express.Router();

router.post('/', protect, validateTransaction, transactionController.prepareTransaction);
router.get('/', protect, transactionController.listTransactions);
router.post('/:id/finalize', protect, transactionController.finalizeTransaction);
router.get('/:id', protect, transactionController.getTransaction);

module.exports = router;
*/
