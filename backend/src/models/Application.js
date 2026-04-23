const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  mission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mission',
    required: true
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  motivation: {
    type: String,
    required: true
  },
  availability: String,
  experience: String,
  selectedDates: [{
    type: Date
  }],
  statusHistory: [{
    status: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    reason: String
  }],
  notes: String,
  hours: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

applicationSchema.index({ mission: 1, volunteer: 1 }, { unique: true });
applicationSchema.index({ volunteer: 1 });
applicationSchema.index({ mission: 1 });
applicationSchema.index({ status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
