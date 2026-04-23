const { body } = require('express-validator');

exports.createMissionValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn([
    'Education', 'Health', 'Environment', 'Social', 'Culture', 'Sport', 'Animals', 'Emergency', 'Other'
  ]).withMessage('Invalid category'),
  body('type').isIn(['one-time', 'recurring', 'long-term']).withMessage('Invalid type'),
  body('volunteersNeeded').isInt({ min: 1 }).withMessage('At least 1 volunteer needed'),
  body('dates').isArray({ min: 1 }).withMessage('At least one date is required')
];

exports.updateMissionValidation = [
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('volunteersNeeded').optional().isInt({ min: 1 })
];

module.exports = exports;
