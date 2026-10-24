const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Equipment = require('./models/Equipment');

dotenv.config();

const seedData = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lab-booking';
    await mongoose.connect(uri);
    console.log(`MongoDB Connected for seeding (${uri})...`);

    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ email: 'admin@lab.com' });
    if (!adminExists) {
      await User.create({
        name: 'Lab Administrator',
        email: 'admin@lab.com',
        password: 'admin123',
        studentId: 'ADMIN001',
        role: 'admin',
      });
      console.log('✓ Admin user created (email: admin@lab.com, password: admin123)');
    } else {
      console.log('→ Admin user already exists, skipping...');
    }

    // Create demo student if doesn't exist
    const studentExists = await User.findOne({ email: 'student@university.ac.za' });
    if (!studentExists) {
      await User.create({
        name: 'Alex Johnson',
        email: 'student@university.ac.za',
        password: 'student123',
        studentId: 'STU2024098',
        role: 'student',
      });
      console.log('✓ Demo student created (email: student@university.ac.za, password: student123)');
    } else {
      console.log('→ Demo student already exists, skipping...');
    }

    // Create sample equipment if none exists
    const equipmentCount = await Equipment.countDocuments();
    if (equipmentCount === 0) {
      const sampleEquipment = [
        {
          name: 'Digital Oscilloscope',
          description: 'A 4-channel digital oscilloscope with 200 MHz bandwidth, suitable for electronic circuit analysis and signal measurement in electronics lab practicals.',
          category: 'Electronics',
          totalQuantity: 5,
          laboratory: 'Electronics Lab - Room 201',
          condition: 'Good',
        },
        {
          name: 'Compound Microscope',
          description: 'High-quality binocular compound microscope with 40x-1000x magnification for biological specimen examination and cell structure analysis.',
          category: 'Biology',
          totalQuantity: 10,
          laboratory: 'Biology Lab - Room 105',
          condition: 'Good',
        },
        {
          name: 'Analytical Balance',
          description: 'Precision analytical balance with 0.0001g readability for accurate chemical measurements and quantitative analysis experiments.',
          category: 'Chemistry',
          totalQuantity: 4,
          laboratory: 'Chemistry Lab - Room 302',
          condition: 'Good',
        },
        {
          name: 'Function Generator',
          description: 'Dual-channel function generator capable of producing sine, square, triangle, and sawtooth waveforms up to 25 MHz for signal testing.',
          category: 'Electronics',
          totalQuantity: 6,
          laboratory: 'Electronics Lab - Room 201',
          condition: 'Good',
        },
        {
          name: 'Spectrophotometer',
          description: 'UV-Vis spectrophotometer for measuring light absorbance and transmittance in chemical solutions for concentration determination.',
          category: 'Chemistry',
          totalQuantity: 3,
          laboratory: 'Chemistry Lab - Room 302',
          condition: 'Fair',
        },
        {
          name: 'Arduino Mega Kit',
          description: 'Complete Arduino Mega development kit with sensors, actuators, breadboards, and components for embedded systems and IoT projects.',
          category: 'Computer Science',
          totalQuantity: 15,
          laboratory: 'Computer Lab - Room 410',
          condition: 'Good',
        },
        {
          name: 'Vernier Caliper Set',
          description: 'High-precision stainless steel vernier caliper with 0.02mm accuracy for mechanical measurement experiments and dimensional analysis.',
          category: 'Mechanical',
          totalQuantity: 20,
          laboratory: 'Mechanical Lab - Room 108',
          condition: 'Good',
        },
        {
          name: 'DC Power Supply',
          description: 'Dual-output adjustable DC power supply (0–30V, 0–5A) for powering electronic circuits and testing prototypes.',
          category: 'Electronics',
          totalQuantity: 8,
          laboratory: 'Electronics Lab - Room 201',
          condition: 'Good',
        },
        {
          name: 'pH Meter',
          description: 'Digital pH meter with automatic temperature compensation for accurate pH measurement in chemistry and biology experiments.',
          category: 'Chemistry',
          totalQuantity: 6,
          laboratory: 'Chemistry Lab - Room 302',
          condition: 'Good',
        },
        {
          name: 'Raspberry Pi 4 Kit',
          description: 'Raspberry Pi 4 Model B (4GB) kit with case, power supply, SD card, and peripherals for networking and computing projects.',
          category: 'Computer Science',
          totalQuantity: 10,
          laboratory: 'Computer Lab - Room 410',
          condition: 'Good',
        },
        {
          name: 'Centrifuge Machine',
          description: 'Benchtop centrifuge with variable speed control (up to 6000 RPM) for separating biological and chemical samples.',
          category: 'Biology',
          totalQuantity: 3,
          laboratory: 'Biology Lab - Room 105',
          condition: 'Fair',
        },
        {
          name: 'Soldering Station',
          description: 'Temperature-controlled soldering station with digital display, suitable for PCB assembly and electronic component soldering.',
          category: 'Electronics',
          totalQuantity: 12,
          laboratory: 'Electronics Lab - Room 201',
          condition: 'Good',
        },
      ];

      await Equipment.insertMany(sampleEquipment);
      console.log(`✓ ${sampleEquipment.length} sample equipment items created`);
    } else {
      console.log(`→ ${equipmentCount} equipment items already exist, skipping...`);
    }

    console.log('\nSeeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
