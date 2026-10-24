const mongoose = require('mongoose');
const Equipment = require('../models/Equipment');
const memoryStore = require('../utils/memoryStore');

// @desc    Get all equipment (with search & filter)
// @route   GET /api/equipment
// @access  Private
const getEquipment = async (req, res, next) => {
  try {
    const { search, category, condition, available, page = 1, limit = 12 } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
      if (category) query.category = category;
      if (condition) query.condition = condition;
      if (available === 'true') {
        query.isAvailable = true;
        query.availableQuantity = { $gt: 0 };
      } else if (available === 'false') {
        query.$or = [{ isAvailable: false }, { availableQuantity: 0 }];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const [equipment, total] = await Promise.all([
        Equipment.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Equipment.countDocuments(query),
      ]);

      return res.status(200).json({
        success: true,
        data: equipment,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
        },
      });
    } else {
      // In-memory fallback
      const result = memoryStore.getEquipmentList({
        search,
        category,
        condition,
        available,
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

// @desc    Get single equipment
// @route   GET /api/equipment/:id
// @access  Private
const getEquipmentById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const equipment = await Equipment.findById(req.params.id);
      if (!equipment) {
        return res.status(404).json({ success: false, message: 'Equipment not found' });
      }
      return res.status(200).json({ success: true, data: equipment });
    } else {
      const equipment = memoryStore.getEquipmentById(req.params.id);
      if (!equipment) {
        return res.status(404).json({ success: false, message: 'Equipment not found' });
      }
      return res.status(200).json({ success: true, data: equipment });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new equipment
// @route   POST /api/equipment
// @access  Admin
const createEquipment = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const equipment = await Equipment.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Equipment added successfully',
        data: equipment,
      });
    } else {
      const equipment = memoryStore.createEquipment(req.body);
      return res.status(201).json({
        success: true,
        message: 'Equipment added successfully',
        data: equipment,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Admin
const updateEquipment = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let equipment = await Equipment.findById(req.params.id);
      if (!equipment) {
        return res.status(404).json({ success: false, message: 'Equipment not found' });
      }

      if (req.body.availableQuantity !== undefined) {
        const total = req.body.totalQuantity !== undefined ? Number(req.body.totalQuantity) : equipment.totalQuantity;
        req.body.availableQuantity = Math.max(0, Math.min(Number(req.body.availableQuantity), total));
      } else if (req.body.totalQuantity !== undefined) {
        const diff = req.body.totalQuantity - equipment.totalQuantity;
        req.body.availableQuantity = Math.max(0, equipment.availableQuantity + diff);
      }

      equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      return res.status(200).json({
        success: true,
        message: 'Equipment updated successfully',
        data: equipment,
      });
    } else {
      const equipment = memoryStore.updateEquipment(req.params.id, req.body);
      if (!equipment) {
        return res.status(404).json({ success: false, message: 'Equipment not found' });
      }
      return res.status(200).json({
        success: true,
        message: 'Equipment updated successfully',
        data: equipment,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Admin
const deleteEquipment = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const equipment = await Equipment.findById(req.params.id);
      if (!equipment) {
        return res.status(404).json({ success: false, message: 'Equipment not found' });
      }
      await Equipment.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Equipment deleted successfully',
      });
    } else {
      const success = memoryStore.deleteEquipment(req.params.id);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Equipment not found' });
      }
      return res.status(200).json({
        success: true,
        message: 'Equipment deleted successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
};
