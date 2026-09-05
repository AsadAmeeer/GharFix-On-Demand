const express = require('express');
const router = express.Router();
const {
  createWorkerProfile,
  getWorkerProfile,
  getAllWorkers,
  updateAvailability,
  getWorkerBookings,
  updateBookingStatus,
} = require('../controllers/workerController');
const { authMiddleware, isWorker } = require('../middleware/auth');

router.post('/profile', authMiddleware, createWorkerProfile);
router.get('/profile/:id', getWorkerProfile);
router.get('/workers', getAllWorkers);
router.put('/availability', authMiddleware, isWorker, updateAvailability);
router.get('/my-bookings', authMiddleware, isWorker, getWorkerBookings);
router.put('/booking/:id', authMiddleware, updateBookingStatus);

module.exports = router;
