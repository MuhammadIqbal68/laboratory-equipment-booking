const User = require('../models/User');
const Equipment = require('../models/Equipment');

const initialEquipment = [
  {
    name: 'Digital Oscilloscope 200MHz',
    description: 'A 4-channel digital storage oscilloscope with 200 MHz bandwidth, 2 GSa/s real-time sampling rate, and FFT spectrum analysis. Ideal for analog and digital circuit practicals.',
    category: 'Electronics',
    totalQuantity: 6,
    availableQuantity: 6,
    laboratory: 'Electronics Lab - Room 201',
    condition: 'Good',
    isAvailable: true,
  },
  {
    name: 'Compound Optical Microscope',
    description: 'High-definition binocular microscope with 40x to 1000x magnification, LED illumination, and mechanical stage. Designed for cellular observation and histology experiments.',
    category: 'Biology',
    totalQuantity: 12,
    availableQuantity: 12,
    laboratory: 'Biology Lab - Room 105',
    condition: 'Good',
    isAvailable: true,
  },
  {
    name: 'Precision Analytical Balance (0.1mg)',
    description: 'High-accuracy analytical balance with 0.0001g readability and draft shield for quantitative chemical formulation and gravimetric assays.',
    category: 'Chemistry',
    totalQuantity: 5,
    availableQuantity: 5,
    laboratory: 'Chemistry Lab - Room 302',
    condition: 'Good',
    isAvailable: true,
  },
  {
    name: 'Arbitrary Waveform Function Generator',
    description: 'Dual-channel DDS function generator providing sine, square, triangle, and arbitrary signals up to 30 MHz with modulation capabilities.',
    category: 'Electronics',
    totalQuantity: 8,
    availableQuantity: 8,
    laboratory: 'Electronics Lab - Room 201',
    condition: 'Good',
    isAvailable: true,
  },
  {
    name: 'UV-Visible Spectrophotometer',
    description: 'Split-beam UV-Vis spectrophotometer (190–1100 nm) with quartz cuvettes for molecular absorption studies, kinetics, and quantitative bio-assays.',
    category: 'Chemistry',
    totalQuantity: 3,
    availableQuantity: 3,
    laboratory: 'Chemistry Lab - Room 302',
    condition: 'Good',
    isAvailable: true,
  },
  {
    name: 'Arduino Mega 2560 Prototyping Kit',
    description: 'Comprehensive embedded electronics kit with sensors (ultrasonic, temperature, PIR), servo motors, relay modules, and breadboard wiring.',
    category: 'Computer Science',
    totalQuantity: 18,
    availableQuantity: 18,
    laboratory: 'Computer Science & IoT Lab - Room 410',
    condition: 'Good',
    isAvailable: true,
  },
  {
    name: 'Digital Vernier Caliper & Micrometer Set',
    description: 'Stainless steel digital vernier caliper (0.01mm resolution) and external micrometer for precision engineering measurements and material testing.',
    category: 'Mechanical',
    totalQuantity: 20,
    availableQuantity: 20,
    laboratory: 'Mechanical Workshop - Room 108',
    condition: 'Good',
    isAvailable: true,
  },
  {
    name: 'Triple Output Regulated DC Power Supply',
    description: '0–30V, 0–5A dual adjustable outputs plus fixed 5V/3A output with digital LED meters, current limiting, and short circuit protection.',
    category: 'Electronics',
    totalQuantity: 10,
    availableQuantity: 10,
    laboratory: 'Electronics Lab - Room 201',
    condition: 'Good',
    isAvailable: true,
  },
  {
    name: 'Digital Benchtop pH / Conductivity Meter',
    description: 'Multi-parameter pH and conductivity benchtop meter with automatic temperature compensation electrode and calibration buffer solutions.',
    category: 'Chemistry',
    totalQuantity: 6,
    availableQuantity: 6,
    laboratory: 'Chemistry Lab - Room 302',
    condition: 'Good',
    isAvailable: true,
  },
  {
    name: 'Raspberry Pi 4 Model B Embedded Workstation',
    description: 'Quad-core 1.5GHz processor with 4GB RAM, pre-configured Linux OS, camera module, and GPIO breakout board for robotics and networking practicals.',
    category: 'Computer Science',
    totalQuantity: 14,
    availableQuantity: 14,
    laboratory: 'Computer Science & IoT Lab - Room 410',
    condition: 'Good',
    isAvailable: true,
  },
  {
    name: 'High-Speed Refrigerated Centrifuge',
    description: 'Variable speed microcentrifuge (up to 14,000 RPM) with aerosol-tight rotor for pelleting DNA/RNA, proteins, and biological samples.',
    category: 'Biology',
    totalQuantity: 4,
    availableQuantity: 4,
    laboratory: 'Biology Lab - Room 105',
    condition: 'Good',
    isAvailable: true,
  },
  {
    name: 'Digital ESD-Safe Soldering Workstation',
    description: 'Microprocessor-controlled 65W soldering iron with rapid heat-up, temperature lock, and hot-air rework tool for PCB assembly.',
    category: 'Electronics',
    totalQuantity: 15,
    availableQuantity: 15,
    laboratory: 'Electronics Lab - Room 201',
    condition: 'Good',
    isAvailable: true,
  },
];

const seedInitialData = async () => {
  try {
    // Check or create admin
    const admin = await User.findOne({ email: 'admin@lab.com' });
    if (!admin) {
      await User.create({
        name: 'Lab Administrator',
        email: 'admin@lab.com',
        password: 'admin123',
        studentId: 'ADMIN001',
        role: 'admin',
      });
      console.log('✓ Initial administrator ready: admin@lab.com (password: admin123)');
    }

    // Check or create demo student
    const student = await User.findOne({ email: 'student@university.ac.za' });
    if (!student) {
      await User.create({
        name: 'Alex Johnson',
        email: 'student@university.ac.za',
        password: 'student123',
        studentId: 'STU2024098',
        role: 'student',
      });
      console.log('✓ Demo student ready: student@university.ac.za (password: student123)');
    }

    // Check or create equipment
    const count = await Equipment.countDocuments();
    if (count === 0) {
      await Equipment.insertMany(initialEquipment);
      console.log(`✓ ${initialEquipment.length} laboratory equipment items seeded successfully`);
    }
  } catch (err) {
    console.error('Error seeding initial data:', err.message);
  }
};

module.exports = { seedInitialData };
