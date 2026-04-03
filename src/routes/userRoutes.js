const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const { userValidator } = require('../middleware/validators');
const validate = require('../middleware/validate');

router.post('/', protect, roleCheck('admin'), createUser);
router.get('/', protect, roleCheck('admin'), getAllUsers);
router.get('/:id', protect, roleCheck('admin'), getUserById);
router.put('/:id', protect, roleCheck('admin'), userValidator, validate, updateUser);
router.delete('/:id', protect, roleCheck('admin'), deleteUser);

module.exports = router;