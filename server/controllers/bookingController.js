const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');
const memoryStore = require('../utils/memoryStore');

// Helper: Mongoose conflict check
const checkConflictMongoose = async (equipmentId, date, startTime, endTime, quantity, excludeBookingId = null) => {
  const query = {
    equipment: equipmentId,
    date: new Date(date),
    status: { $in: ['Approved', 'Pending'] },
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const overlapping = await Booking.find(query);
  const totalBooked = overlapping.reduce((sum, b) => sum + b.quantity, 0);

  const equipment = await Equipment.findById(equipmentId);
  if (!equipment) return { conflict: true, message: 'Equipment not found' };

  if (totalBooked + quantity > equipment.totalQuantity) {
    return {
      conflict: true,
      message: `Conflict: Only ${Math.max(0, equipment.totalQuantity - totalBooked)} of ${equipment.totalQuantity} units are available for this time window.`,
    };
  }

  return { conflict: false };
};

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { equipment: equipmentId, date, startTime, endTime, purpose, quantity = 1 } = req.body;

    // Validate booking date is not in the past
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book equipment for a past date',
      });
    }

    if (mongoose.connection.readyState === 1) {
      const equipmentDoc = await Equipment.findById(equipmentId);
      if (!equipmentDoc) {
        return res.status(404).json({ success: false, message: 'Equipment not found' });
      }
      if (!equipmentDoc.isAvailable) {
        return res.status(400).json({
          success: false,
          message: 'This equipment is currently unavailable for booking',
        });
      }

      const conflictResult = await checkConflictMongoose(equipmentId, date, startTime, endTime, quantity);
      if (conflictResult.conflict) {
        return res.status(409).json({ success: false, message: conflictResult.message });
      }

      const booking = await Booking.create({
        user: req.user._id,
        equipment: equipmentId,
        quantity,
        date: bookingDate,
        startTime,
        endTime,
        purpose,
      });

      await booking.populate([
        { path: 'equipment', select: 'name category laboratory' },
        { path: 'user', select: 'name email studentId' },
      ]);

      return res.status(201).json({
        success: true,
        message: 'Booking request submitted successfully',
        data: booking,
      });
    } else {
      // In-memory fallback
      const eq = memoryStore.getEquipmentById(equipmentId);
      if (!eq) return res.status(404).json({ success: false, message: 'Equipment not found' });
      if (!eq.isAvailable) {
        return res.status(400).json({
          success: false,
          message: 'This equipment is currently unavailable for booking',
        });
      }

      const conflict = memoryStore.checkConflict(equipmentId, date, startTime, endTime, quantity);
      if (conflict.conflict) {
        return res.status(409).json({ success: false, message: conflict.message });
      }

      const booking = memoryStore.createBooking(req.user._id, {
        equipment: equipmentId,
        date,
        startTime,
        endTime,
        purpose,
        quantity,
      });

      return res.status(201).json({
        success: true,
        message: 'Booking request submitted successfully',
        data: booking,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = { user: req.user._id };
      if (status) query.status = status;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const [bookings, total] = await Promise.all([
        Booking.find(query)
          .populate('equipment', 'name category laboratory image')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Booking.countDocuments(query),
      ]);

      return res.status(200).json({
        success: true,
        data: bookings,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
        },
      });
    } else {
      const result = memoryStore.getBookings({
        userId: req.user._id,
        status,
        page,
        limit,
      });

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          current: parseInt(page),
          pages: result.pages,
          total: result.total,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (status) query.status = status;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const [bookings, total] = await Promise.all([
        Booking.find(query)
          .populate('user', 'name email studentId')
          .populate('equipment', 'name category laboratory image')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Booking.countDocuments(query),
      ]);

      return res.status(200).json({
        success: true,
        data: bookings,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
        },
      });
    } else {
      const result = memoryStore.getBookings({
        status,
        page,
        limit,
      });

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          current: parseInt(page),
          pages: result.pages,
          total: result.total,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const booking = await Booking.findById(req.params.id)
        .populate('user', 'name email studentId')
        .populate('equipment', 'name category laboratory description image totalQuantity availableQuantity');

      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
      }

      return res.status(200).json({ success: true, data: booking });
    } else {
      const booking = memoryStore.getBookingById(req.params.id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

      if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
      }

      return res.status(200).json({ success: true, data: booking });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (admin)
// @route   PATCH /api/bookings/:id/status
// @access  Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    if (!['Approved', 'Rejected', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Approved, Rejected, or Completed',
      });
    }

    if (mongoose.connection.readyState === 1) {
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

      if (status === 'Approved') {
        const conflict = await checkConflictMongoose(
          booking.equipment,
          booking.date,
          booking.startTime,
          booking.endTime,
          booking.quantity,
          booking._id
        );
        if (conflict.conflict) {
          return res.status(409).json({ success: false, message: conflict.message });
        }
      }

      const previousStatus = booking.status;
      booking.status = status;
      if (adminNotes !== undefined) booking.adminNotes = adminNotes;
      await booking.save();

      // Keep inventory in sync: an "Approved" booking holds a unit out of the
      // pool; leaving "Approved" (via Completed or Rejected) returns it. This
      // only fires on the actual transition, so a Pending -> Rejected booking
      // (which never held a unit) correctly leaves the count untouched.
      const wasHolding = previousStatus === 'Approved';
      const isHolding = status === 'Approved';
      if (wasHolding !== isHolding) {
        const equipmentDoc = await Equipment.findById(booking.equipment);
        if (equipmentDoc) {
          if (isHolding) {
            equipmentDoc.availableQuantity = Math.max(0, equipmentDoc.availableQuantity - booking.quantity);
          } else {
            equipmentDoc.availableQuantity = Math.min(
              equipmentDoc.totalQuantity,
              equipmentDoc.availableQuantity + booking.quantity
            );
          }
          await equipmentDoc.save();
        }
      }

      await booking.populate([
        { path: 'user', select: 'name email studentId' },
        { path: 'equipment', select: 'name category laboratory' },
      ]);

      return res.status(200).json({
        success: true,
        message: `Booking ${status.toLowerCase()} successfully`,
        data: booking,
      });
    } else {
      const updated = memoryStore.updateBookingStatus(req.params.id, status, adminNotes);
      if (!updated) return res.status(404).json({ success: false, message: 'Booking not found' });

      return res.status(200).json({
        success: true,
        message: `Booking ${status.toLowerCase()} successfully`,
        data: updated,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking (student)
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

      if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
      }

      if (booking.status !== 'Pending') {
        return res.status(400).json({
          success: false,
          message: `Cannot cancel a booking with status '${booking.status}'. Only pending bookings can be cancelled.`,
        });
      }

      booking.status = 'Cancelled';
      await booking.save();

      return res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking,
      });
    } else {
      const result = memoryStore.cancelBooking(req.params.id, req.user._id);
      if (result.error) {
        return res.status(400).json({ success: false, message: result.error });
      }
      return res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: result.data,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
};
