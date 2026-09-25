const mongoose = require('mongoose');
const { seedInitialData } = require('../utils/seedData');

const connectDB = async () => {
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
    console.log('ℹ️ No MONGO_URI specified in .env. Running with fast embedded in-memory data store for local development.');
    console.log('✓ Initial administrator ready: admin@lab.com (password: admin123)');
    console.log('✓ Initial demo student ready: student@university.ac.za (password: student123)');
  }
};

module.exports = connectDB;
