const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const MealSelection = require('../models/MealSelection');
const auth = require('../middleware/auth');
const crypto = require('crypto');
const mongoose = require('mongoose');
const MealRating = require('../models/MealRating');

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
    let { studentId, hostelId, dayOfWeek, selections, studentName, studentEmail } = req.body;
    const today = new Date().toISOString().split('T')[0];

    console.log('[Server] Received meal selection request:', {
      studentId,
      hostelId,
      dayOfWeek,
      selections,
      studentName,
      studentEmail
    });

    // Validate required fields
    if (!studentId || !hostelId || !dayOfWeek || !selections || !studentName || !studentEmail) {
      console.log('[Server] Missing required fields:', {
        studentId: !!studentId,
        hostelId: !!hostelId,
        dayOfWeek: !!dayOfWeek,
        selections: !!selections,
        studentName: !!studentName,
        studentEmail: !!studentEmail
      });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert string IDs to ObjectId if they're not already
    try {
      console.log('[Server] Converting IDs:', {
        studentId,
        hostelId,
        studentIdType: typeof studentId,
        hostelIdType: typeof hostelId
      });

      // If IDs are already ObjectId instances, use them as is
      if (studentId instanceof mongoose.Types.ObjectId) {
        console.log('[Server] studentId is already an ObjectId');
      } else {
        // Convert string to ObjectId
        studentId = new mongoose.Types.ObjectId(studentId);
        console.log('[Server] Converted studentId to ObjectId');
      }

      if (hostelId instanceof mongoose.Types.ObjectId) {
        console.log('[Server] hostelId is already an ObjectId');
      } else {
        // Convert string to ObjectId
        hostelId = new mongoose.Types.ObjectId(hostelId);
        console.log('[Server] Converted hostelId to ObjectId');
      }

      console.log('[Server] After conversion:', {
        studentId,
        hostelId,
        studentIdType: typeof studentId,
        hostelIdType: typeof hostelId
      });
    } catch (error) {
      console.error('[Server] Error converting IDs to ObjectId:', error);
      console.error('[Server] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return res.status(400).json({ 
        error: 'Invalid student or hostel ID format',
        details: error.message 
      });
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

    console.log('[Server] Existing meal selection:', mealSelection);

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
    const meals = {
      breakfast: { selected: false, qrCode: null, used: false, usedAt: null, submittedAt: null },
      lunch: { selected: false, qrCode: null, used: false, usedAt: null, submittedAt: null },
      dinner: { selected: false, qrCode: null, used: false, usedAt: null, submittedAt: null }
    };

    // If there's an existing selection, merge it with our default structure
    if (mealSelection) {
      Object.keys(meals).forEach(mealType => {
        if (mealSelection.meals[mealType]) {
          meals[mealType] = { ...meals[mealType], ...mealSelection.meals[mealType] };
        }
      });
    }

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

    console.log('[Server] Updated meals object:', JSON.stringify(meals, null, 2));

    // Get the latest expiry time among selected meals
    const expiryTimes = Object.entries(selections)
      .filter(([_, selected]) => selected)
      .map(([meal]) => getMealExpiryTime(meal, today));
    const latestExpiry = new Date(Math.max(...expiryTimes));

    try {
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
    } catch (saveError) {
      console.error('[Server] Error saving meal selection:', saveError);
      console.error('[Server] Save error details:', {
        name: saveError.name,
        message: saveError.message,
        stack: saveError.stack,
        validationErrors: saveError.errors,
        mealsObject: JSON.stringify(meals, null, 2)
      });
      return res.status(500).json({ 
        error: 'Error saving meal selection',
        details: saveError.message 
      });
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
    console.error('[Server] Error in meal selection route:', error);
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
    const { qrCode } = req.body;

    if (!qrCode) {
      return res.status(400).json({ error: 'QR code is required' });
    }

    // Find the menu item with the matching QR code in any meal type
    const menuItem = await MealSelection.findOne({
      $or: [
        { 'meals.breakfast.qrCode': qrCode },
        { 'meals.lunch.qrCode': qrCode },
        { 'meals.dinner.qrCode': qrCode }
      ]
    });

    if (!menuItem) {
      return res.status(404).json({ error: 'Invalid QR code' });
    }

    // Determine which meal type has this QR code
    let mealType;
    if (menuItem.meals.breakfast.qrCode === qrCode) mealType = 'breakfast';
    else if (menuItem.meals.lunch.qrCode === qrCode) mealType = 'lunch';
    else if (menuItem.meals.dinner.qrCode === qrCode) mealType = 'dinner';

    // Check if QR code has already been used
    if (menuItem.meals[mealType].used) {
      return res.status(400).json({
        error: 'QR code has already been used',
        studentName: menuItem.studentName,
        mealType: mealType,
        usedAt: menuItem.meals[mealType].usedAt
      });
    }

    // Mark QR code as used
    menuItem.meals[mealType].used = true;
    menuItem.meals[mealType].usedAt = new Date();
    await menuItem.save();

    return res.json({
      success: true,
      message: 'QR code validated successfully',
      studentName: menuItem.studentName,
      mealType: mealType,
      usedAt: menuItem.meals[mealType].usedAt
    });
  } catch (error) {
    console.error('Error validating QR code:', error);
    res.status(500).json({ error: 'Internal server error' });
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

// Get meal selections for a specific date
router.get('/selections/date/:date', auth, async (req, res) => {
  try {
    const { date } = req.params;
    const { hostelId } = req.query;

    if (!hostelId) {
      return res.status(400).json({ error: 'Hostel ID is required' });
    }

    const selections = await MealSelection.find({
      hostelId,
      date
    }).select('studentName studentEmail meals');

    res.json(selections);
  } catch (error) {
    console.error('[Server] Error fetching meal selections by date:', error);
    res.status(500).json({ error: 'Error fetching meal selections' });
  }
});

// Save or update a meal rating
router.post('/rate', auth, async (req, res) => {
  try {
    const { studentId, hostelId, date, mealType, rating } = req.body;
    if (!studentId || !hostelId || !date || !mealType || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (![1,2,3,4,5].includes(rating)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    // Upsert: update if exists, insert if not
    const mealRating = await MealRating.findOneAndUpdate(
      { studentId, hostelId, date, mealType },
      { rating, createdAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ message: 'Rating saved', mealRating });
  } catch (error) {
    console.error('[Server] Error saving meal rating:', error);
    res.status(500).json({ error: 'Error saving meal rating', details: error.message });
  }
});

// Get ratings for a student (optionally filtered by date)
router.get('/ratings/:studentId', auth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { date } = req.query;
    const query = { studentId };
    if (date) query.date = date;
    const ratings = await MealRating.find(query);
    res.json(ratings);
  } catch (error) {
    console.error('[Server] Error fetching meal ratings:', error);
    res.status(500).json({ error: 'Error fetching meal ratings', details: error.message });
  }
});

module.exports = router; 