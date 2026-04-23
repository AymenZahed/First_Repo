const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  mission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mission',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  categories: {
    communication: Number,
    professionalism: Number,
    punctuality: Number,
    quality: Number
  },
  response: {
    content: String,
    createdAt: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

reviewSchema.index({ mission: 1 });
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ reviewee: 1 });
reviewSchema.index({ mission: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
