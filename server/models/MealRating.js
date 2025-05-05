const mongoose = require('mongoose');

const mealRatingSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner'],
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a student can only rate a meal once per day
mealRatingSchema.index({ studentId: 1, date: 1, mealType: 1 }, { unique: true });

const MealRating = mongoose.model('MealRating', mealRatingSchema);

module.exports = MealRating; 