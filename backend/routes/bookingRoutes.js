const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingDetails,
  cancelBooking,
} = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, createBooking);
router.get('/my-bookings', authMiddleware, getMyBookings);
router.get('/:id', authMiddleware, getBookingDetails);
router.put('/:id/cancel', authMiddleware, cancelBooking);

module.exports = router;
