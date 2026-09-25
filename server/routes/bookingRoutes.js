const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { bookingRules, validate } = require('../utils/validators');

// Student routes
router.post('/', protect, bookingRules, validate, createBooking);
router.get('/my', protect, getMyBookings);
router.patch('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/', protect, authorize('admin'), getAllBookings);
router.patch('/:id/status', protect, authorize('admin'), updateBookingStatus);

// Shared route (with ownership check in controller)
router.get('/:id', protect, getBookingById);

module.exports = router;
