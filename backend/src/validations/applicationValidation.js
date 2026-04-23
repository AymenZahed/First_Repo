const { body } = require('express-validator');

exports.createApplicationValidation = [
  body('missionId').notEmpty().withMessage('Mission ID is required'),
  body('motivation').trim().notEmpty().withMessage('Motivation is required').isLength({ min: 50 }).withMessage('Motivation must be at least 50 characters')
];

exports.updateStatusValidation = [
  body('status').isIn(['accepted', 'rejected']).withMessage('Invalid status')
];

module.exports = exports;
