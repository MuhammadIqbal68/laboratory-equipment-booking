const express = require('express');
const router = express.Router();
const {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} = require('../controllers/equipmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { equipmentRules, validate } = require('../utils/validators');

router
  .route('/')
  .get(protect, getEquipment)
  .post(protect, authorize('admin'), equipmentRules, validate, createEquipment);

router
  .route('/:id')
  .get(protect, getEquipmentById)
  .put(protect, authorize('admin'), updateEquipment)
  .delete(protect, authorize('admin'), deleteEquipment);

module.exports = router;
