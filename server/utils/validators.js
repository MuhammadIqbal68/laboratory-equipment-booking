const { body, validationResult } = require('express-validator');

// Process validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array().map((e) => e.msg).join('. '),
      errors: errors.array(),
    });
  }
  next();
};

// Registration validation rules
const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('studentId').trim().notEmpty().withMessage('Student ID is required'),
];

// Login validation rules
const loginRules = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Equipment validation rules
const equipmentRules = [
  body('name').trim().notEmpty().withMessage('Equipment name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('totalQuantity')
    .isInt({ min: 1 })
    .withMessage('Total quantity must be at least 1'),
  body('laboratory').trim().notEmpty().withMessage('Laboratory/location is required'),
];

// Booking validation rules
const bookingRules = [
  body('equipment').notEmpty().withMessage('Equipment ID is required'),
  body('date').isISO8601().withMessage('Valid booking date is required'),
  body('startTime')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Start time must be in HH:MM format'),
  body('endTime')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('End time must be in HH:MM format'),
  body('purpose').trim().notEmpty().withMessage('Purpose is required'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  equipmentRules,
  bookingRules,
};
