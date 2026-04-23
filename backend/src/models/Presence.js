const mongoose = require('mongoose');

const presenceSchema = new mongoose.Schema({
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
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  checkIn: {
    time: {
      type: Date,
      required: true
    },
    method: {
      type: String,
      enum: ['qr-code', 'manual', 'gps'],
      default: 'qr-code'
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    }
  },
  checkOut: {
    time: Date,
    method: {
      type: String,
      enum: ['qr-code', 'manual', 'gps']
    },
    location: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: [Number]
    }
  },
  duration: Number,
  status: {
    type: String,
    enum: ['checked-in', 'checked-out', 'validated', 'disputed'],
    default: 'checked-in'
  },
  notes: String,
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  validatedAt: Date
}, {
  timestamps: true
});

presenceSchema.index({ mission: 1 });
presenceSchema.index({ volunteer: 1 });
presenceSchema.index({ application: 1 });
presenceSchema.index({ 'checkIn.time': -1 });

module.exports = mongoose.model('Presence', presenceSchema);
