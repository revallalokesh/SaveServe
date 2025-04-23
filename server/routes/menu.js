const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const auth = require('../middleware/auth');

// Get menu for a hostel
router.get('/', auth, async (req, res) => {
  try {
    let menu = await Menu.findOne({ hostelId: req.user.id });
    
    if (!menu) {
      // If no menu exists, create one with empty arrays
      const emptyMeal = {
        breakfast: [],
        lunch: [],
        dinner: []
      };
      
      menu = new Menu({
        hostelId: req.user.id,
        weeklyMenu: {
          Monday: emptyMeal,
          Tuesday: emptyMeal,
          Wednesday: emptyMeal,
          Thursday: emptyMeal,
          Friday: emptyMeal,
          Saturday: emptyMeal,
          Sunday: emptyMeal
        }
      });
      
      await menu.save();
    }
    
    res.json(menu.weeklyMenu);
  } catch (error) {
    console.error('Error getting menu:', error);
    res.status(500).json({ error: 'Error fetching menu' });
  }
});

// Update menu for a specific day and meal
router.put('/:day/:meal', auth, async (req, res) => {
  try {
    const { day, meal } = req.params;
    const { items } = req.body;

    // Validate day
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!validDays.includes(day)) {
      return res.status(400).json({ error: 'Invalid day' });
    }

    // Validate meal
    const validMeals = ['breakfast', 'lunch', 'dinner'];
    if (!validMeals.includes(meal)) {
      return res.status(400).json({ error: 'Invalid meal' });
    }

    // Validate items
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items must be an array' });
    }

    let menu = await Menu.findOne({ hostelId: req.user.id });
    
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    // Update the specific meal
    menu.weeklyMenu[day][meal] = items;
    menu.updatedAt = Date.now();
    
    await menu.save();
    
    res.json(menu.weeklyMenu);
  } catch (error) {
    console.error('Error updating menu:', error);
    res.status(500).json({ error: 'Error updating menu' });
  }
});

module.exports = router; 