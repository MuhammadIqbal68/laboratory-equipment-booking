const express = require('express');
const router = express.Router();
const { getStudentDashboard, getAdminDashboard } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/student', protect, getStudentDashboard);
router.get('/admin', protect, authorize('admin'), getAdminDashboard);

module.exports = router;
