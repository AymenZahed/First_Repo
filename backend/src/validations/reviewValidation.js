const { body } = require('express-validator');

exports.createReviewValidation = [
  body('mission').notEmpty().withMessage('Mission ID is required'),
  body('reviewee').notEmpty().withMessage('Reviewee ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required').isLength({ min: 20 }).withMessage('Comment must be at least 20 characters')
];

module.exports = exports;
