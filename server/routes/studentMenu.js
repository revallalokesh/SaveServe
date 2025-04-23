const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const MealSelection = require('../models/MealSelection');
const auth = require('../middleware/auth');
const crypto = require('crypto');

// Helper function to generate secure QR code
function generateQRCode(studentId, hostelId, meal, date) {
  const data = `${studentId}-${hostelId}-${meal}-${date}-${Date.now()}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Helper function to get meal expiry time
function getMealExpiryTime(meal, date) {
  const mealTimes = {
    breakfast: 10, // 10:00 AM
    lunch: 15,     // 3:00 PM
    dinner: 22     // 10:00 PM
  };

  const expiryDate = new Date(date);
  expiryDate.setHours(mealTimes[meal], 0, 0, 0);
  return expiryDate;
}

// Get weekly menu for a hostel (public route - no auth required)
router.get('/:hostelId', async (req, res) => {
  try {
    const { hostelId } = req.params;
    console.log('[Server] Student fetching menu for hostel:', hostelId);

    const menu = await Menu.findOne({ hostelId }).lean();

    if (!menu) {
      return res.status(404).json({ error: 'Menu not found for this hostel' });
    }

    console.log('[Server] Found menu:', menu.weeklyMenu ? 'Yes' : 'No');

    res.json(menu.weeklyMenu || {
      Monday: { breakfast: [], lunch: [], dinner: [] },
      Tuesday: { breakfast: [], lunch: [], dinner: [] },
      Wednesday: { breakfast: [], lunch: [], dinner: [] },
      Thursday: { breakfast: [], lunch: [], dinner: [] },
      Friday: { breakfast: [], lunch: [], dinner: [] },
      Saturday: { breakfast: [], lunch: [], dinner: [] },
      Sunday: { breakfast: [], lunch: [], dinner: [] }
    });
  } catch (error) {
    console.error('[Server] Error fetching student menu:', error);
    res.status(500).json({ error: 'Error fetching menu' });
  }
});

// Submit meal selections for a student
router.post('/select', auth, async (req, res) => {
  try {
    const { studentId, hostelId, dayOfWeek, selections, studentName, studentEmail } = req.body;
    const today = new Date().toISOString().split('T')[0];

    // Validate required fields
    if (!studentId || !hostelId || !dayOfWeek || !selections || !studentName || !studentEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate day of week
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!validDays.includes(dayOfWeek)) {
      return res.status(400).json({ error: 'Invalid day of week' });
    }

    // Find existing meal selection
    let mealSelection = await MealSelection.findOne({
      studentId,
      hostelId,
      dayOfWeek,
      date: today
    });

    // Check if any meal is being resubmitted
    if (mealSelection) {
      for (const [meal, selected] of Object.entries(selections)) {
        if (selected && mealSelection.meals[meal].selected) {
          return res.status(400).json({ 
            error: `${meal.charAt(0).toUpperCase() + meal.slice(1)} has already been submitted for today` 
          });
        }
      }
    }

    // Initialize or update meals object
    const meals = mealSelection ? { ...mealSelection.meals } : {
      breakfast: { selected: false, qrCode: null, used: false, usedAt: null, submittedAt: null },
      lunch: { selected: false, qrCode: null, used: false, usedAt: null, submittedAt: null },
      dinner: { selected: false, qrCode: null, used: false, usedAt: null, submittedAt: null }
    };

    // Update only the selected meal
    for (const [meal, selected] of Object.entries(selections)) {
      if (selected) {
        meals[meal] = {
          selected: true,
          qrCode: generateQRCode(studentId, hostelId, meal, today),
          used: false,
          usedAt: null,
          submittedAt: new Date()
        };
      }
    }

    // Get the latest expiry time among selected meals
    const expiryTimes = Object.entries(selections)
      .filter(([_, selected]) => selected)
      .map(([meal]) => getMealExpiryTime(meal, today));
    const latestExpiry = new Date(Math.max(...expiryTimes));

    if (mealSelection) {
      // Update existing selection
      mealSelection.meals = meals;
      mealSelection.expiresAt = latestExpiry;
      mealSelection.studentName = studentName;
      mealSelection.studentEmail = studentEmail;
      await mealSelection.save();
    } else {
      // Create new selection
      mealSelection = new MealSelection({
        studentId,
        studentName,
        studentEmail,
        hostelId,
        dayOfWeek,
        date: today,
        meals,
        expiresAt: latestExpiry
      });
      await mealSelection.save();
    }

    // Return only the QR codes for newly selected meals
    const qrCodes = {};
    for (const [meal, selected] of Object.entries(selections)) {
      if (selected) {
        qrCodes[meal] = meals[meal].qrCode;
      }
    }

    res.json({
      message: 'Meal selections saved successfully',
      qrCodes,
      studentDetails: {
        name: studentName,
        email: studentEmail
      }
    });
  } catch (error) {
    console.error('[Server] Error saving meal selections:', error);
    console.error('[Server] Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Error saving meal selections',
      details: error.message 
    });
  }
});

// Validate and mark QR code as used
router.post('/validate-qr', auth, async (req, res) => {
  try {
    const { studentId, qrCode, meal } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const mealSelection = await MealSelection.findOne({
      studentId,
      date: today,
      [`meals.${meal}.qrCode`]: qrCode,
      [`meals.${meal}.used`]: false
    });

    if (!mealSelection) {
      return res.status(404).json({ error: 'Invalid or expired QR code' });
    }

    // Check if meal time has expired
    const mealExpiry = getMealExpiryTime(meal, today);
    if (new Date() > mealExpiry) {
      return res.status(400).json({ error: 'Meal time has expired' });
    }

    // Mark QR code as used
    mealSelection.meals[meal].used = true;
    mealSelection.meals[meal].usedAt = new Date();
    await mealSelection.save();

    res.json({ message: 'QR code validated successfully' });
  } catch (error) {
    console.error('[Server] Error validating QR code:', error);
    res.status(500).json({ error: 'Error validating QR code' });
  }
});

// Get student's meal selections for today
router.get('/selections/:studentId', auth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const today = new Date().toISOString().split('T')[0];

    const selections = await MealSelection.findOne({
      studentId,
      date: today
    });

    res.json(selections || { meals: { breakfast: {}, lunch: {}, dinner: {} } });
  } catch (error) {
    console.error('[Server] Error fetching meal selections:', error);
    res.status(500).json({ error: 'Error fetching meal selections' });
  }
});

module.exports = router; 