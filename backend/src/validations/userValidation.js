const { body } = require('express-validator');

exports.registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['volunteer', 'organization']).withMessage('Invalid role'),
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('organizationName').optional().trim().notEmpty()
];

exports.updateProfileValidation = [
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('website').optional().isURL().withMessage('Invalid URL')
];

module.exports = exports;
