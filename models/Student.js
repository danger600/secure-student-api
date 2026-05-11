const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide first name'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Please provide last name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  rollNumber: {
    type: String,
    required: [true, 'Please provide roll number'],
    unique: true
  },
  grade: {
    type: String,
    required: [true, 'Please provide grade'],
    enum: ['A', 'B', 'C', 'D', 'F']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please provide date of birth']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide phone number']
  },
  address: {
    type: String,
    required: [true, 'Please provide address']
  },
  parentName: {
    type: String,
    required: [true, 'Please provide parent name']
  },
  parentPhone: {
    type: String,
    required: [true, 'Please provide parent phone number']
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt before saving
studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Student', studentSchema);
