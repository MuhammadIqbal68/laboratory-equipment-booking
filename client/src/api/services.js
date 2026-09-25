import API from './axios';

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Equipment
export const getEquipment = (params) => API.get('/equipment', { params });
export const getEquipmentById = (id) => API.get(`/equipment/${id}`);
export const createEquipment = (data) => API.post('/equipment', data);
export const updateEquipment = (id, data) => API.put(`/equipment/${id}`, data);
export const deleteEquipment = (id) => API.delete(`/equipment/${id}`);

// Bookings
export const createBooking = (data) => API.post('/bookings', data);
export const getMyBookings = (params) => API.get('/bookings/my', { params });
export const getAllBookings = (params) => API.get('/bookings', { params });
export const getBookingById = (id) => API.get(`/bookings/${id}`);
export const updateBookingStatus = (id, data) => API.patch(`/bookings/${id}/status`, data);
export const cancelBooking = (id) => API.patch(`/bookings/${id}/cancel`);

// Dashboard
export const getStudentDashboard = () => API.get('/dashboard/student');
export const getAdminDashboard = () => API.get('/dashboard/admin');
