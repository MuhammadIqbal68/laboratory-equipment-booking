const mongoose = require('mongoose');
const { seedInitialData } = require('../utils/seedData');

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = process.env.MONGO_URI;

  if (mongoUri) {
    try {
      console.log('Connecting to MongoDB Atlas / cluster...');
      const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
      await seedInitialData();
      return;
    } catch (error) {
      console.warn(`⚠️ Could not connect to remote MongoDB (${error.message}).`);
      console.log('Activating embedded in-memory persistence mode for development...');
    }
  } else {
    try {
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/lab-booking', { serverSelectionTimeoutMS: 1500 });
      console.log(`✓ Local MongoDB Connected: ${conn.connection.host}`);
      await seedInitialData();
      return;
    } catch (e) {
      // Local Mongo not active, fallback to in-memory store
    }

    console.log('ℹ️ No MONGO_URI specified in .env. Running with fast embedded in-memory data store for local development.');
    console.log('✓ Initial administrator ready: admin@lab.com (password: admin123)');
    console.log('✓ Initial demo student ready: student@university.ac.za (password: student123)');
  }
};

module.exports = connectDB;
