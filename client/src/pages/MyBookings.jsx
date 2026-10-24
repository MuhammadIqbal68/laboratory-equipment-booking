import { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking } from '../api/services';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { formatDate, formatTime, BOOKING_STATUSES } from '../utils/helpers';
import { HiOutlineBan, HiOutlineCalendar, HiOutlineInformationCircle, HiOutlineEye } from 'react-icons/hi';

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

  // View Details Modal
  const [viewingBooking, setViewingBooking] = useState(null);

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
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn btn--secondary btn--sm"
                        onClick={() => setViewingBooking(b)}
                        title="View Details"
                        id={`view-my-booking-${b._id}`}
                      >
                        <HiOutlineEye size={14} /> View
                      </button>
                      {b.status === 'Pending' && (
                        <button
                          className="btn btn--danger btn--sm"
                          onClick={() => setSelectedBooking(b)}
                          id={`cancel-booking-${b._id}`}
                        >
                          <HiOutlineBan size={14} /> Cancel
                        </button>
                      )}
                    </div>
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

      {/* View Booking Details Modal */}
      <Modal
        isOpen={!!viewingBooking}
        onClose={() => setViewingBooking(null)}
        title="Booking Details"
        footer={
          <div style={{ display: 'flex', gap: '8px' }}>
            {viewingBooking?.status === 'Pending' && (
              <button
                className="btn btn--danger btn--sm"
                onClick={() => {
                  const b = viewingBooking;
                  setViewingBooking(null);
                  setSelectedBooking(b);
                }}
              >
                <HiOutlineBan size={14} /> Cancel Booking
              </button>
            )}
            <button className="btn btn--primary btn--sm" onClick={() => setViewingBooking(null)}>
              Close
            </button>
          </div>
        }
      >
        {viewingBooking && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Equipment</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>{viewingBooking.equipment?.name || 'N/A'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Laboratory</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>{viewingBooking.equipment?.laboratory || 'N/A'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Date & Time</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>
                  {formatDate(viewingBooking.date)} ({formatTime(viewingBooking.startTime)} - {formatTime(viewingBooking.endTime)})
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Quantity</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>{viewingBooking.quantity} unit(s)</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Status</span>
                <div style={{ marginTop: '2px' }}>
                  <StatusBadge status={viewingBooking.status} />
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Submitted On</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>{formatDate(viewingBooking.createdAt)}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Academic Purpose</span>
              <p style={{ marginTop: '4px', fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {viewingBooking.purpose}
              </p>
            </div>

            {viewingBooking.adminNotes && (
              <div
                style={{
                  marginTop: '14px',
                  padding: '12px',
                  background: viewingBooking.status === 'Rejected' ? '#FEE2E2' : 'var(--gray-50)',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${viewingBooking.status === 'Rejected' ? '#FCA5A5' : 'var(--border-light)'}`,
                }}
              >
                <span style={{ fontSize: '0.75rem', color: viewingBooking.status === 'Rejected' ? '#991B1B' : 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                  {viewingBooking.status === 'Rejected' ? 'Reason for Rejection' : 'Administrator Remarks'}
                </span>
                <p style={{ marginTop: '4px', fontSize: '0.9rem', color: viewingBooking.status === 'Rejected' ? '#B91C1C' : 'var(--text-secondary)' }}>
                  {viewingBooking.adminNotes}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyBookings;
