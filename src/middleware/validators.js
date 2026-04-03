const { body } = require('express-validator');

exports.registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('role')
    .optional()
    .isIn(['admin', 'analyst', 'viewer']).withMessage('Role must be admin, analyst or viewer'),
];

exports.loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

exports.transactionValidator = [
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),

  body('type')
    .notEmpty().withMessage('Type is required')
    .isIn(['income', 'expense']).withMessage('Type must be income or expense'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn([
      'salary', 'freelance', 'investment',
      'food', 'transport', 'utilities',
      'entertainment', 'healthcare', 'other',
    ]).withMessage('Invalid category'),

  body('date')
    .optional()
    .isISO8601().withMessage('Date must be a valid date format (YYYY-MM-DD)'),

  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
];

exports.userValidator = [
  body('role')
    .optional()
    .isIn(['admin', 'analyst', 'viewer']).withMessage('Role must be admin, analyst or viewer'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be true or false'),
];