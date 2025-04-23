const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  breakfast: {
    type: [String],
    required: true
  },
  lunch: {
    type: [String],
    required: true
  },
  dinner: {
    type: [String],
    required: true
  }
});

const menuSchema = new mongoose.Schema({
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true
  },
  weeklyMenu: {
    Monday: mealSchema,
    Tuesday: mealSchema,
    Wednesday: mealSchema,
    Thursday: mealSchema,
    Friday: mealSchema,
    Saturday: mealSchema,
    Sunday: mealSchema
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Delete and recreate the model to ensure clean state
if (mongoose.models.Menu) {
  delete mongoose.models.Menu;
}

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu; 