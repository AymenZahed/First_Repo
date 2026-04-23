const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Education',
      'Health',
      'Environment',
      'Social',
      'Culture',
      'Sport',
      'Animals',
      'Emergency',
      'Other'
    ]
  },
  type: {
    type: String,
    enum: ['one-time', 'recurring', 'long-term'],
    required: true
  },
  skills: [String],
  requirements: {
    minAge: Number,
    maxAge: Number,
    physicalAbility: String,
    experience: String,
    certifications: [String]
  },
  location: {
    address: String,
    city: String,
    postalCode: String,
    country: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    }
  },
  isRemote: {
    type: Boolean,
    default: false
  },
  dates: [{
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    startTime: String,
    endTime: String
  }],
  volunteersNeeded: {
    type: Number,
    required: true,
    min: 1
  },
  volunteersAccepted: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
    default: 'draft'
  },
  images: [String],
  contactInfo: {
    name: String,
    email: String,
    phone: String
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  benefits: [String],
  tasks: [String],
  equipmentProvided: [String],
  qrCode: String,
  views: {
    type: Number,
    default: 0
  },
  applicationsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

missionSchema.index({ 'location.coordinates': '2dsphere' });
missionSchema.index({ organization: 1 });
missionSchema.index({ status: 1 });
missionSchema.index({ category: 1 });
missionSchema.index({ 'dates.startDate': 1 });

module.exports = mongoose.model('Mission', missionSchema);
