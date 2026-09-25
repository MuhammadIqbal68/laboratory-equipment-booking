const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');
const User = require('../models/User');
const memoryStore = require('../utils/memoryStore');

// @desc    Get student dashboard stats
// @route   GET /api/dashboard/student
// @access  Private
const getStudentDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (mongoose.connection.readyState === 1) {
      const [
        totalBookings,
        pendingBookings,
        approvedBookings,
        rejectedBookings,
        completedBookings,
        cancelledBookings,
        recentBookings,
      ] = await Promise.all([
        Booking.countDocuments({ user: userId }),
        Booking.countDocuments({ user: userId, status: 'Pending' }),
        Booking.countDocuments({ user: userId, status: 'Approved' }),
        Booking.countDocuments({ user: userId, status: 'Rejected' }),
        Booking.countDocuments({ user: userId, status: 'Completed' }),
        Booking.countDocuments({ user: userId, status: 'Cancelled' }),
        Booking.find({ user: userId })
          .populate('equipment', 'name category laboratory')
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

      return res.status(200).json({
        success: true,
        data: {
          stats: {
            total: totalBookings,
            pending: pendingBookings,
            approved: approvedBookings,
            rejected: rejectedBookings,
            completed: completedBookings,
            cancelled: cancelledBookings,
          },
          recentBookings,
        },
      });
    } else {
      const dashboard = memoryStore.getStudentDashboard(userId);
      return res.status(200).json({ success: true, data: dashboard });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Admin
const getAdminDashboard = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const [
        totalEquipment,
        availableEquipment,
        maintenanceEquipment,
        totalBookings,
        pendingBookings,
        approvedBookings,
        completedBookings,
        totalStudents,
        recentBookings,
      ] = await Promise.all([
        Equipment.countDocuments(),
        Equipment.countDocuments({ isAvailable: true, availableQuantity: { $gt: 0 } }),
        Equipment.countDocuments({ condition: 'Under Maintenance' }),
        Booking.countDocuments(),
        Booking.countDocuments({ status: 'Pending' }),
        Booking.countDocuments({ status: 'Approved' }),
        Booking.countDocuments({ status: 'Completed' }),
        User.countDocuments({ role: 'student' }),
        Booking.find()
          .populate('user', 'name email studentId')
          .populate('equipment', 'name category')
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

      return res.status(200).json({
        success: true,
        data: {
          stats: {
            totalEquipment,
            availableEquipment,
            maintenanceEquipment,
            totalBookings,
            pendingBookings,
            approvedBookings,
            completedBookings,
            totalStudents,
          },
          recentBookings,
        },
      });
    } else {
      const dashboard = memoryStore.getAdminDashboard();
      return res.status(200).json({ success: true, data: dashboard });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getStudentDashboard, getAdminDashboard };
