const bcrypt = require('bcryptjs');

let users = [];
let equipment = [];
let bookings = [];

// Helper ID generator
const generateId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

// Initialize memory store with seed data
const initMemoryStore = async () => {
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('admin123', salt);
  const studentPasswordHash = await bcrypt.hash('student123', salt);

  users = [
    {
      _id: 'user_admin_001',
      name: 'Lab Administrator',
      email: 'admin@lab.com',
      password: adminPasswordHash,
      studentId: 'ADMIN001',
      role: 'admin',
      createdAt: new Date(),
    },
    {
      _id: 'user_student_001',
      name: 'Alex Johnson',
      email: 'student@university.ac.za',
      password: studentPasswordHash,
      studentId: 'STU2024098',
      role: 'student',
      createdAt: new Date(),
    },
  ];

  equipment = [
    {
      _id: 'eq_001',
      name: 'Digital Oscilloscope 200MHz',
      description: 'A 4-channel digital storage oscilloscope with 200 MHz bandwidth, 2 GSa/s real-time sampling rate, and FFT spectrum analysis. Ideal for analog and digital circuit practicals.',
      category: 'Electronics',
      totalQuantity: 6,
      availableQuantity: 6,
      laboratory: 'Electronics Lab - Room 201',
      condition: 'Good',
      isAvailable: true,
      createdAt: new Date(),
    },
    {
      _id: 'eq_002',
      name: 'Compound Optical Microscope',
      description: 'High-definition binocular microscope with 40x to 1000x magnification, LED illumination, and mechanical stage. Designed for cellular observation and histology experiments.',
      category: 'Biology',
      totalQuantity: 12,
      availableQuantity: 12,
      laboratory: 'Biology Lab - Room 105',
      condition: 'Good',
      isAvailable: true,
      createdAt: new Date(),
    },
    {
      _id: 'eq_003',
      name: 'Precision Analytical Balance (0.1mg)',
      description: 'High-accuracy analytical balance with 0.0001g readability and draft shield for quantitative chemical formulation and gravimetric assays.',
      category: 'Chemistry',
      totalQuantity: 5,
      availableQuantity: 5,
      laboratory: 'Chemistry Lab - Room 302',
      condition: 'Good',
      isAvailable: true,
      createdAt: new Date(),
    },
    {
      _id: 'eq_004',
      name: 'Arbitrary Waveform Function Generator',
      description: 'Dual-channel DDS function generator providing sine, square, triangle, and arbitrary signals up to 30 MHz with modulation capabilities.',
      category: 'Electronics',
      totalQuantity: 8,
      availableQuantity: 8,
      laboratory: 'Electronics Lab - Room 201',
      condition: 'Good',
      isAvailable: true,
      createdAt: new Date(),
    },
    {
      _id: 'eq_005',
      name: 'UV-Visible Spectrophotometer',
      description: 'Split-beam UV-Vis spectrophotometer (190–1100 nm) with quartz cuvettes for molecular absorption studies, kinetics, and quantitative bio-assays.',
      category: 'Chemistry',
      totalQuantity: 3,
      availableQuantity: 3,
      laboratory: 'Chemistry Lab - Room 302',
      condition: 'Good',
      isAvailable: true,
      createdAt: new Date(),
    },
    {
      _id: 'eq_006',
      name: 'Arduino Mega 2560 Prototyping Kit',
      description: 'Comprehensive embedded electronics kit with sensors (ultrasonic, temperature, PIR), servo motors, relay modules, and breadboard wiring.',
      category: 'Computer Science',
      totalQuantity: 18,
      availableQuantity: 18,
      laboratory: 'Computer Science & IoT Lab - Room 410',
      condition: 'Good',
      isAvailable: true,
      createdAt: new Date(),
    },
    {
      _id: 'eq_007',
      name: 'Digital Vernier Caliper & Micrometer Set',
      description: 'Stainless steel digital vernier caliper (0.01mm resolution) and external micrometer for precision engineering measurements and material testing.',
      category: 'Mechanical',
      totalQuantity: 20,
      availableQuantity: 20,
      laboratory: 'Mechanical Workshop - Room 108',
      condition: 'Good',
      isAvailable: true,
      createdAt: new Date(),
    },
    {
      _id: 'eq_008',
      name: 'Triple Output Regulated DC Power Supply',
      description: '0–30V, 0–5A dual adjustable outputs plus fixed 5V/3A output with digital LED meters, current limiting, and short circuit protection.',
      category: 'Electronics',
      totalQuantity: 10,
      availableQuantity: 10,
      laboratory: 'Electronics Lab - Room 201',
      condition: 'Good',
      isAvailable: true,
      createdAt: new Date(),
    },
    {
      _id: 'eq_009',
      name: 'Digital Benchtop pH / Conductivity Meter',
      description: 'Multi-parameter pH and conductivity benchtop meter with automatic temperature compensation electrode and calibration buffer solutions.',
      category: 'Chemistry',
      totalQuantity: 6,
      availableQuantity: 6,
      laboratory: 'Chemistry Lab - Room 302',
      condition: 'Good',
      isAvailable: true,
      createdAt: new Date(),
    },
    {
      _id: 'eq_010',
      name: 'Raspberry Pi 4 Model B Workstation',
      description: 'Quad-core 1.5GHz processor with 4GB RAM, pre-configured Linux OS, camera module, and GPIO breakout board for robotics and networking practicals.',
      category: 'Computer Science',
      totalQuantity: 14,
      availableQuantity: 14,
      laboratory: 'Computer Science & IoT Lab - Room 410',
      condition: 'Good',
      isAvailable: true,
      createdAt: new Date(),
    },
    {
      _id: 'eq_011',
      name: 'High-Speed Refrigerated Centrifuge',
      description: 'Variable speed microcentrifuge (up to 14,000 RPM) with aerosol-tight rotor for pelleting DNA/RNA, proteins, and biological samples.',
      category: 'Biology',
      totalQuantity: 4,
      availableQuantity: 4,
      laboratory: 'Biology Lab - Room 105',
      condition: 'Good',
      isAvailable: true,
      createdAt: new Date(),
    },
    {
      _id: 'eq_012',
      name: 'Digital ESD-Safe Soldering Workstation',
      description: 'Microprocessor-controlled 65W soldering iron with rapid heat-up, temperature lock, and hot-air rework tool for PCB assembly.',
      category: 'Electronics',
      totalQuantity: 15,
      availableQuantity: 15,
      laboratory: 'Electronics Lab - Room 201',
      condition: 'Good',
      isAvailable: true,
      createdAt: new Date(),
    },
  ];

  bookings = [
    {
      _id: 'book_001',
      user: users[1],
      equipment: equipment[0],
      quantity: 1,
      date: new Date(Date.now() + 86400000 * 2),
      startTime: '10:00',
      endTime: '12:00',
      purpose: 'Frequency response analysis of bandpass active filter for EE302 project',
      status: 'Approved',
      adminNotes: 'Approved for Lab Room 201 work bench #4',
      createdAt: new Date(Date.now() - 3600000 * 24),
    },
    {
      _id: 'book_002',
      user: users[1],
      equipment: equipment[1],
      quantity: 1,
      date: new Date(Date.now() + 86400000 * 4),
      startTime: '14:00',
      endTime: '16:00',
      purpose: 'Cell wall division histology specimen examination',
      status: 'Pending',
      adminNotes: '',
      createdAt: new Date(Date.now() - 3600000 * 5),
    },
  ];
};

initMemoryStore();

const memoryStore = {
  // Users
  findUserByEmail: (email) => users.find((u) => u.email.toLowerCase() === email.toLowerCase()),
  findUserByStudentId: (studentId) => users.find((u) => u.studentId === studentId),
  findUserById: (id) => users.find((u) => u._id.toString() === id.toString()),
  createUser: async (data) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const newUser = {
      _id: generateId(),
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      studentId: data.studentId,
      role: data.role || 'student',
      createdAt: new Date(),
    };
    users.push(newUser);
    return newUser;
  },

  // Equipment
  getEquipmentList: ({ search, category, condition, available, page = 1, limit = 12 }) => {
    let filtered = [...equipment];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (e) => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
      );
    }
    if (category) {
      filtered = filtered.filter((e) => e.category === category);
    }
    if (condition) {
      filtered = filtered.filter((e) => e.condition === condition);
    }
    if (available === 'true') {
      filtered = filtered.filter((e) => e.isAvailable && e.availableQuantity > 0);
    } else if (available === 'false') {
      filtered = filtered.filter((e) => !e.isAvailable || e.availableQuantity === 0);
    }

    const total = filtered.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paged = filtered.slice(skip, skip + parseInt(limit));

    return { data: paged, total, pages: Math.ceil(total / parseInt(limit)) };
  },

  getEquipmentById: (id) => equipment.find((e) => e._id.toString() === id.toString()),

  createEquipment: (data) => {
    const totalQty = Number(data.totalQuantity) || 1;
    const item = {
      _id: generateId(),
      name: data.name,
      description: data.description,
      category: data.category,
      totalQuantity: totalQty,
      availableQuantity: totalQty,
      laboratory: data.laboratory,
      condition: data.condition || 'Good',
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      createdAt: new Date(),
    };
    equipment.unshift(item);
    return item;
  },

  updateEquipment: (id, data) => {
    const idx = equipment.findIndex((e) => e._id.toString() === id.toString());
    if (idx === -1) return null;

    const existing = equipment[idx];
    const totalQty = data.totalQuantity !== undefined ? Number(data.totalQuantity) : existing.totalQuantity;
    let availableQty;
    if (data.availableQuantity !== undefined) {
      availableQty = Math.max(0, Math.min(Number(data.availableQuantity), totalQty));
    } else {
      const diff = totalQty - existing.totalQuantity;
      availableQty = Math.max(0, existing.availableQuantity + diff);
    }

    const updated = {
      ...existing,
      ...data,
      totalQuantity: totalQty,
      availableQuantity: availableQty,
      updatedAt: new Date(),
    };
    equipment[idx] = updated;
    return updated;
  },

  deleteEquipment: (id) => {
    const idx = equipment.findIndex((e) => e._id.toString() === id.toString());
    if (idx === -1) return false;
    equipment.splice(idx, 1);
    return true;
  },

  // Bookings
  checkConflict: (equipmentId, dateStr, startTime, endTime, quantity, excludeId = null) => {
    const targetDate = new Date(dateStr).toISOString().split('T')[0];
    const eq = equipment.find((e) => e._id.toString() === equipmentId.toString());
    if (!eq) return { conflict: true, message: 'Equipment not found' };

    const overlapping = bookings.filter((b) => {
      if (b._id.toString() === (excludeId || '').toString()) return false;
      if (b.equipment._id.toString() !== equipmentId.toString()) return false;
      if (!['Pending', 'Approved'].includes(b.status)) return false;

      const bDate = new Date(b.date).toISOString().split('T')[0];
      if (bDate !== targetDate) return false;

      // Time overlap check: start1 < end2 and end1 > start2
      return b.startTime < endTime && b.endTime > startTime;
    });

    const bookedCount = overlapping.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
    if (bookedCount + quantity > eq.totalQuantity) {
      const remaining = Math.max(0, eq.totalQuantity - bookedCount);
      return {
        conflict: true,
        message: `Conflict: Only ${remaining} of ${eq.totalQuantity} units are available for this time window.`,
      };
    }

    return { conflict: false };
  },

  createBooking: (userId, data) => {
    const user = users.find((u) => u._id.toString() === userId.toString());
    const eq = equipment.find((e) => e._id.toString() === data.equipment.toString());
    if (!eq) throw new Error('Equipment not found');

    const booking = {
      _id: generateId(),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
      },
      equipment: {
        _id: eq._id,
        name: eq.name,
        category: eq.category,
        laboratory: eq.laboratory,
      },
      quantity: Number(data.quantity) || 1,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      purpose: data.purpose,
      status: 'Pending',
      adminNotes: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    bookings.unshift(booking);
    return booking;
  },

  getBookings: ({ userId, status, page = 1, limit = 10 }) => {
    let list = [...bookings];
    if (userId) {
      list = list.filter((b) => b.user._id.toString() === userId.toString());
    }
    if (status) {
      list = list.filter((b) => b.status === status);
    }
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = list.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paged = list.slice(skip, skip + parseInt(limit));

    return { data: paged, total, pages: Math.ceil(total / parseInt(limit)) };
  },

  getBookingById: (id) => bookings.find((b) => b._id.toString() === id.toString()),

  updateBookingStatus: (id, status, adminNotes) => {
    const booking = bookings.find((b) => b._id.toString() === id.toString());
    if (!booking) return null;

    const previousStatus = booking.status;
    booking.status = status;
    if (adminNotes !== undefined) booking.adminNotes = adminNotes;
    booking.updatedAt = new Date();

    // Only adjust inventory on the actual transition into/out of "Approved",
    // so a Pending -> Rejected booking (which never held a unit) doesn't
    // incorrectly get a unit added back.
    const wasHolding = previousStatus === 'Approved';
    const isHolding = status === 'Approved';
    if (wasHolding !== isHolding) {
      const eq = equipment.find((e) => e._id.toString() === booking.equipment._id.toString());
      if (eq) {
        if (isHolding) {
          eq.availableQuantity = Math.max(0, eq.availableQuantity - booking.quantity);
        } else {
          eq.availableQuantity = Math.min(eq.totalQuantity, eq.availableQuantity + booking.quantity);
        }
      }
    }

    return booking;
  },

  cancelBooking: (id, userId) => {
    const booking = bookings.find((b) => b._id.toString() === id.toString());
    if (!booking) return { error: 'Booking not found' };
    if (booking.user._id.toString() !== userId.toString()) {
      return { error: 'Not authorized to cancel this booking' };
    }
    if (booking.status !== 'Pending') {
      return { error: `Cannot cancel a booking with status '${booking.status}'` };
    }

    booking.status = 'Cancelled';
    booking.updatedAt = new Date();
    return { data: booking };
  },

  // Dashboards
  getStudentDashboard: (userId) => {
    const userBookings = bookings.filter((b) => b.user._id.toString() === userId.toString());
    return {
      stats: {
        total: userBookings.length,
        pending: userBookings.filter((b) => b.status === 'Pending').length,
        approved: userBookings.filter((b) => b.status === 'Approved').length,
        rejected: userBookings.filter((b) => b.status === 'Rejected').length,
        completed: userBookings.filter((b) => b.status === 'Completed').length,
        cancelled: userBookings.filter((b) => b.status === 'Cancelled').length,
      },
      recentBookings: userBookings.slice(0, 5),
    };
  },

  getAdminDashboard: () => {
    return {
      stats: {
        totalEquipment: equipment.length,
        availableEquipment: equipment.filter((e) => e.isAvailable && e.availableQuantity > 0).length,
        maintenanceEquipment: equipment.filter((e) => e.condition === 'Under Maintenance').length,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((b) => b.status === 'Pending').length,
        approvedBookings: bookings.filter((b) => b.status === 'Approved').length,
        completedBookings: bookings.filter((b) => b.status === 'Completed').length,
        totalStudents: users.filter((u) => u.role === 'student').length,
      },
      recentBookings: bookings.slice(0, 5),
    };
  },
};

module.exports = memoryStore;
