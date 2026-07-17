const express = require('express'); const controller = require('../controllers/settingsController'); const { protect } = require('../middleware/authMiddleware');
const router = express.Router(); router.use(protect); router.get('/', controller.getSettings); router.patch('/', controller.updateSettings); module.exports = router;
