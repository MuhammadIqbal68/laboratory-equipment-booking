import { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking } from '../api/services';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { formatDate, formatTime, BOOKING_STATUSES } from '../utils/helpers';
import { HiOutlineBan, HiOutlineCalendar, HiOutlineInformationCircle } from 'react-icons/hi';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Cancellation Modal
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const res = await getMyBookings(params);
      setBookings(res.data.data);
      setTotalPages(res.data.pagination.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, statusFilter]);

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;
    try {
      setCancelLoading(true);
      await cancelBooking(selectedBooking._id);
      setSuccess('Booking successfully cancelled');
      setSelectedBooking(null);
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Equipment Bookings</h1>
        <p>Review the status of your equipment requests or cancel upcoming sessions</p>
      </div>

      <Alert type="success" message={success} onClose={() => setSuccess('')} />
      <Alert type="error" message={error} onClose={() => setError('')} />

      {/* Filter Tabs */}
      <div className="card mb-lg" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '8px' }}>
            Filter by Status:
          </span>
          <button
            className={`btn btn--sm ${statusFilter === '' ? 'btn--primary' : 'btn--secondary'}`}
            onClick={() => { setStatusFilter(''); setPage(1); }}
          >
            All
          </button>
          {BOOKING_STATUSES.map((st) => (
            <button
              key={st}
              className={`btn btn--sm ${statusFilter === st ? 'btn--primary' : 'btn--secondary'}`}
              onClick={() => { setStatusFilter(st); setPage(1); }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader text="Loading your bookings..." />
      ) : bookings.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state__icon">📅</div>
          <div className="empty-state__title">No bookings found</div>
          <div className="empty-state__desc">
            {statusFilter
              ? `You have no bookings with '${statusFilter}' status.`
              : 'You have not submitted any equipment booking requests yet.'}
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Lab / Location</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Qty</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td style={{ fontWeight: 600 }}>{b.equipment?.name || 'Unknown'}</td>
                  <td>{b.equipment?.laboratory || 'N/A'}</td>
                  <td>{formatDate(b.date)}</td>
                  <td>{formatTime(b.startTime)} - {formatTime(b.endTime)}</td>
                  <td>{b.quantity}</td>
                  <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={b.purpose}>
                    {b.purpose}
                  </td>
                  <td>
                    <StatusBadge status={b.status} />
                  </td>
                  <td>
                    {b.status === 'Pending' ? (
                      <button
                        className="btn btn--danger btn--sm"
                        onClick={() => setSelectedBooking(b)}
                        id={`cancel-booking-${b._id}`}
                      >
                        <HiOutlineBan size={14} /> Cancel
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Cancel Equipment Booking"
        footer={
          <>
            <button className="btn btn--ghost" onClick={() => setSelectedBooking(null)}>
              Keep Booking
            </button>
            <button
              className="btn btn--danger"
              disabled={cancelLoading}
              onClick={handleCancelConfirm}
              id="confirm-cancel-booking"
            >
              {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </>
        }
      >
        <p>
          Are you sure you want to cancel your booking request for{' '}
          <strong>{selectedBooking?.equipment?.name}</strong> on{' '}
          <strong>{formatDate(selectedBooking?.date)}</strong>?
        </p>
        <p style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          This action will release the slot and cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default MyBookings;
