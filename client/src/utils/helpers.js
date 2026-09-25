export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (time) => {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

export const getStatusColor = (status) => {
  const map = {
    Pending: 'pending',
    Approved: 'approved',
    Rejected: 'rejected',
    Cancelled: 'cancelled',
    Completed: 'completed',
  };
  return map[status] || 'pending';
};

export const getCategoryIcon = (category) => {
  const map = {
    Chemistry: '🧪',
    Physics: '⚛️',
    Biology: '🔬',
    Electronics: '🔌',
    'Computer Science': '💻',
    Mechanical: '⚙️',
    General: '🔧',
  };
  return map[category] || '📦';
};

export const CATEGORIES = [
  'Chemistry',
  'Physics',
  'Biology',
  'Electronics',
  'Computer Science',
  'Mechanical',
  'General',
];

export const CONDITIONS = ['Good', 'Fair', 'Under Maintenance'];

export const BOOKING_STATUSES = ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed'];
