const mongoose = require('mongoose');

const mealSelectionSchema = new mongoose.Schema({
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
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  date: {
    type: String, // Store as YYYY-MM-DD
    required: true
  },
  meals: {
    breakfast: {
      selected: { type: Boolean, default: false },
      qrCode: String,
      used: { type: Boolean, default: false },
      usedAt: Date,
      submittedAt: Date
    },
    lunch: {
      selected: { type: Boolean, default: false },
      qrCode: String,
      used: { type: Boolean, default: false },
      usedAt: Date,
      submittedAt: Date
    },
    dinner: {
      selected: { type: Boolean, default: false },
      qrCode: String,
      used: { type: Boolean, default: false },
      usedAt: Date,
      submittedAt: Date
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

// Update the updatedAt timestamp before saving
mealSelectionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create compound indexes
mealSelectionSchema.index({ studentId: 1, date: 1 }, { unique: true });
mealSelectionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for automatic deletion

// Delete and recreate the model to ensure clean state
if (mongoose.models.MealSelection) {
  delete mongoose.models.MealSelection;
}

const MealSelection = mongoose.model('MealSelection', mealSelectionSchema);

module.exports = MealSelection; 