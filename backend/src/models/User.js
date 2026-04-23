const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['volunteer', 'organization', 'admin'],
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // Volunteer specific fields
  firstName: String,
  lastName: String,
  phone: String,
  dateOfBirth: Date,
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  skills: [String],
  interests: [String],
  availability: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  profilePicture: String,
  bio: String,
  totalHours: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    icon: String,
    earnedAt: Date
  }],

  // Organization specific fields
  organizationName: String,
  organizationType: {
    type: String,
    enum: ['NGO', 'Association', 'Foundation', 'Public', 'Other']
  },
  siret: String,
  description: String,
  logo: String,
  website: String,
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String
  },
  contactPerson: {
    name: String,
    position: String,
    email: String,
    phone: String
  },
  isValidated: {
    type: Boolean,
    default: false
  },
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  validatedAt: Date,

  // Common fields
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    sms: { type: Boolean, default: false }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  fcmToken: String
}, {
  timestamps: true
});

userSchema.index({ location: '2dsphere' });
userSchema.index({ role: 1 });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
