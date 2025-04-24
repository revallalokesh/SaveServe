const express = require('express');
const router = express.Router();
const StudentMealStatus = require('../models/StudentMealStatus');
const auth = require('../middleware/auth');
const crypto = require('crypto');
const mongoose = require('mongoose');

// Helper function to generate QR code
function generateQRCode(studentId, hostelId, meal, date) {
  const data = `${studentId}-${hostelId}-${meal}-${date}-${Date.now()}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Get meal status for a specific date
router.get('/date/:date', auth, async (req, res) => {
  try {
    const { date } = req.params;
    const { hostelId } = req.query;

    if (!hostelId) {
      return res.status(400).json({ error: 'Hostel ID is required' });
    }

    const mealStatus = await StudentMealStatus.find({
      hostelId,
      date
    }).select('studentName studentEmail meals');

    res.json(mealStatus);
  } catch (error) {
    console.error('[Server] Error fetching meal status:', error);
    res.status(500).json({ error: 'Error fetching meal status' });
  }
});

// Update meal status for a student
router.post('/update', auth, async (req, res) => {
  try {
    const { studentId, hostelId, date, meal, opted, studentName, studentEmail } = req.body;

    if (!studentId || !hostelId || !date || !meal || !studentName || !studentEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate meal type
    const validMeals = ['breakfast', 'lunch', 'dinner'];
    if (!validMeals.includes(meal)) {
      return res.status(400).json({ error: 'Invalid meal type' });
    }

    let mealStatus = await StudentMealStatus.findOne({
      studentId,
      hostelId,
      date
    });

    if (!mealStatus) {
      mealStatus = new StudentMealStatus({
        studentId,
        studentName,
        studentEmail,
        hostelId,
        date,
        meals: {
          breakfast: { opted: false, qrCode: null, used: false, usedAt: null },
          lunch: { opted: false, qrCode: null, used: false, usedAt: null },
          dinner: { opted: false, qrCode: null, used: false, usedAt: null }
        }
      });
    }

    // Update the specific meal
    mealStatus.meals[meal] = {
      opted,
      qrCode: opted ? generateQRCode(studentId, hostelId, meal, date) : null,
      used: false,
      usedAt: null
    };

    await mealStatus.save();

    res.json({
      message: 'Meal status updated successfully',
      qrCode: mealStatus.meals[meal].qrCode
    });
  } catch (error) {
    console.error('[Server] Error updating meal status:', error);
    res.status(500).json({ error: 'Error updating meal status' });
  }
});

// Mark QR code as used
router.post('/use-qr', auth, async (req, res) => {
  try {
    const { studentId, qrCode, meal } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const mealStatus = await StudentMealStatus.findOne({
      studentId,
      date: today,
      [`meals.${meal}.qrCode`]: qrCode,
      [`meals.${meal}.used`]: false
    });

    if (!mealStatus) {
      return res.status(404).json({ error: 'Invalid or expired QR code' });
    }

    mealStatus.meals[meal].used = true;
    mealStatus.meals[meal].usedAt = new Date();
    await mealStatus.save();

    res.json({ message: 'QR code marked as used successfully' });
  } catch (error) {
    console.error('[Server] Error marking QR code as used:', error);
    res.status(500).json({ error: 'Error marking QR code as used' });
  }
});

module.exports = router; 