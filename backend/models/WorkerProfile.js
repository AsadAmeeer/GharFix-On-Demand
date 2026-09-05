const mongoose = require('mongoose');

const workerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  profession: {
    type: String,
    enum: ['electrician', 'plumber', 'carpenter', 'painter', 'mason', 'cleaner'],
    required: true,
  },
  experience: {
    type: Number, // years
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  location: {
    city: String,
    area: String,
  },
  skills: [String],
  availability: [{
    day: String,
    startTime: String,
    endTime: String,
  }],
  averageRating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('WorkerProfile', workerProfileSchema);