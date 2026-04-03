const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const { transactionValidator } = require('../middleware/validators');
const validate = require('../middleware/validate');

router.post('/', protect, roleCheck('admin', 'analyst'), transactionValidator, validate, createTransaction);
router.get('/', protect, roleCheck('admin', 'analyst', 'viewer'), getTransactions);
router.get('/:id', protect, roleCheck('admin', 'analyst', 'viewer'), getTransactionById);
router.put('/:id', protect, roleCheck('admin'), transactionValidator, validate, updateTransaction);
router.delete('/:id', protect, roleCheck('admin'), deleteTransaction);

module.exports = router;