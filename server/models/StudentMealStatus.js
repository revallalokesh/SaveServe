const mongoose = require('mongoose');

const studentMealStatusSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true
  },
  date: {
    type: String, // Store as YYYY-MM-DD
    required: true
  },
  meals: {
    breakfast: {
      opted: { type: Boolean, default: false },
      qrCode: String,
      used: { type: Boolean, default: false },
      usedAt: Date
    },
    lunch: {
      opted: { type: Boolean, default: false },
      qrCode: String,
      used: { type: Boolean, default: false },
      usedAt: Date
    },
    dinner: {
      opted: { type: Boolean, default: false },
      qrCode: String,
      used: { type: Boolean, default: false },
      usedAt: Date
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
studentMealStatusSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create compound indexes
studentMealStatusSchema.index({ studentId: 1, date: 1 }, { unique: true });

// Delete and recreate the model to ensure clean state
if (mongoose.models.StudentMealStatus) {
  delete mongoose.models.StudentMealStatus;
}

const StudentMealStatus = mongoose.model('StudentMealStatus', studentMealStatusSchema);

module.exports = StudentMealStatus; 