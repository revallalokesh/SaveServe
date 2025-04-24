const mongoose = require('mongoose')

const studentMenuSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  mealType: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner']
  },
  date: {
    type: Date,
    required: true
  },
  qrCode: {
    type: String,
    required: true,
    unique: true
  },
  usedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
})

// Create index for faster QR code lookups
studentMenuSchema.index({ qrCode: 1 })

// Create compound index for student and date queries
studentMenuSchema.index({ student: 1, date: 1 })

const StudentMenu = mongoose.model('StudentMenu', studentMenuSchema)

module.exports = StudentMenu 