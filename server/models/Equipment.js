const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Equipment name is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: [
          'Chemistry',
          'Physics',
          'Biology',
          'Electronics',
          'Computer Science',
          'Mechanical',
          'General',
        ],
        message: '{VALUE} is not a valid category',
      },
    },
    totalQuantity: {
      type: Number,
      required: [true, 'Total quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    availableQuantity: {
      type: Number,
      min: [0, 'Available quantity cannot be negative'],
    },
    laboratory: {
      type: String,
      required: [true, 'Laboratory/location is required'],
      trim: true,
    },
    condition: {
      type: String,
      enum: {
        values: ['Good', 'Fair', 'Under Maintenance'],
        message: '{VALUE} is not a valid condition',
      },
      default: 'Good',
    },
    image: {
      type: String,
      default: '',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Set availableQuantity to totalQuantity if not specified
equipmentSchema.pre('save', function (next) {
  if (this.isNew && this.availableQuantity === undefined) {
    this.availableQuantity = this.totalQuantity;
  }
  next();
});

module.exports = mongoose.model('Equipment', equipmentSchema);
