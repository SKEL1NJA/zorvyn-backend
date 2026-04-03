const express = require('express');
const router = express.Router();
const {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentTransactions,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/summary', protect, roleCheck('admin', 'analyst', 'viewer'), getSummary);
router.get('/categories', protect, roleCheck('admin', 'analyst'), getCategoryTotals);
router.get('/trends', protect, roleCheck('admin', 'analyst'), getMonthlyTrends);
router.get('/recent', protect, roleCheck('admin', 'analyst', 'viewer'), getRecentTransactions);

module.exports = router;