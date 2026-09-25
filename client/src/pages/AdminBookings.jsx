import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllBookings, updateBookingStatus } from '../api/services';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { formatDate, formatTime, BOOKING_STATUSES } from '../utils/helpers';
import {
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineClipboardCheck,
  HiOutlineInformationCircle,
} from 'react-icons/hi';

const AdminBookings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || '';

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Status Action Modal (Reject or Add Note)
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    booking: null,
    targetStatus: '',
    adminNotes: '',
    loading: false,
    error: '',
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const res = await getAllBookings(params);
      setBookings(res.data.data);
      setTotalPages(res.data.pagination.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch student booking records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, statusFilter]);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPage(1);
    if (status) {
      setSearchParams({ status });
    } else {
      setSearchParams({});
    }
  };

  const handleQuickApprove = async (booking) => {
    try {
      setLoading(true);
      await updateBookingStatus(booking._id, { status: 'Approved' });
      setSuccess(`Booking for ${booking.user?.name} approved successfully`);
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve booking. There might be a slot conflict.');
      setLoading(false);
    }
  };

  const handleOpenActionModal = (booking, targetStatus) => {
    setActionModal({
      isOpen: true,
      booking,
      targetStatus,
      adminNotes: '',
      loading: false,
      error: '',
    });
  };

  const handleActionModalSubmit = async (e) => {
    e.preventDefault();
    setActionModal((prev) => ({ ...prev, loading: true, error: '' }));

    try {
      await updateBookingStatus(actionModal.booking._id, {
        status: actionModal.targetStatus,
        adminNotes: actionModal.adminNotes,
      });

      setSuccess(`Booking status marked as ${actionModal.targetStatus}`);
      setActionModal({
        isOpen: false,
        booking: null,
        targetStatus: '',
        adminNotes: '',
        loading: false,
        error: '',
      });
      fetchBookings();
    } catch (err) {
      setActionModal((prev) => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Failed to update booking status',
      }));
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Student Booking Requests</h1>
        <p>Review, approve, reject, and monitor laboratory usage requests</p>
      </div>

      <Alert type="success" message={success} onClose={() => setSuccess('')} />
      <Alert type="error" message={error} onClose={() => setError('')} />

      {/* Filter Tabs */}
      <div className="card mb-lg" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '8px' }}>
            Filter Status:
          </span>
          <button
            className={`btn btn--sm ${statusFilter === '' ? 'btn--primary' : 'btn--secondary'}`}
            onClick={() => handleStatusFilterChange('')}
          >
            All Requests
          </button>
          {BOOKING_STATUSES.map((st) => (
            <button
              key={st}
              className={`btn btn--sm ${statusFilter === st ? 'btn--primary' : 'btn--secondary'}`}
              onClick={() => handleStatusFilterChange(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <Loader text="Loading requests..." />
      ) : bookings.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state__icon">📋</div>
          <div className="empty-state__title">No bookings found</div>
          <div className="empty-state__desc">
            {statusFilter
              ? `There are no requests matching the '${statusFilter}' status.`
              : 'There are currently no student booking submissions on record.'}
          </div>
        </div>
      ) : (
        <>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Student ID</th>
                <th>Equipment</th>
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
                  <td style={{ fontWeight: 600 }}>{b.user?.name || 'Unknown'}</td>
                  <td>{b.user?.studentId || 'N/A'}</td>
                  <td>{b.equipment?.name || 'Unknown'}</td>
                  <td>{formatDate(b.date)}</td>
                  <td>{formatTime(b.startTime)} - {formatTime(b.endTime)}</td>
                  <td>{b.quantity}</td>
                  <td style={{ maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={b.purpose}>
                    {b.purpose}
                  </td>
                  <td>
                    <StatusBadge status={b.status} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {b.status === 'Pending' && (
                        <>
                          <button
                            className="btn btn--primary btn--sm"
                            onClick={() => handleQuickApprove(b)}
                            title="Approve Booking"
                            id={`approve-booking-${b._id}`}
                          >
                            <HiOutlineCheck size={14} /> Approve
                          </button>
                          <button
                            className="btn btn--danger btn--sm"
                            onClick={() => handleOpenActionModal(b, 'Rejected')}
                            title="Reject Booking"
                            id={`reject-booking-${b._id}`}
                          >
                            <HiOutlineX size={14} /> Reject
                          </button>
                        </>
                      )}

                      {b.status === 'Approved' && (
                        <button
                          className="btn btn--secondary btn--sm"
                          onClick={() => handleOpenActionModal(b, 'Completed')}
                          title="Mark Equipment Returned / Session Completed"
                          id={`complete-booking-${b._id}`}
                        >
                          <HiOutlineClipboardCheck size={14} /> Complete
                        </button>
                      )}

                      {['Rejected', 'Cancelled', 'Completed'].includes(b.status) && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Closed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination__btn"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`pagination__btn ${page === p ? 'pagination__btn--active' : ''}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="pagination__btn"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}
        </>
      )}

      {/* Action / Rejection Modal */}
      <Modal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal((prev) => ({ ...prev, isOpen: false }))}
        title={`${actionModal.targetStatus === 'Rejected' ? 'Reject' : 'Complete'} Booking Request`}
      >
        <Alert type="error" message={actionModal.error} onClose={() => setActionModal((prev) => ({ ...prev, error: '' }))} />

        <form onSubmit={handleActionModalSubmit}>
          <p style={{ marginBottom: '16px' }}>
            You are marking the booking request by{' '}
            <strong>{actionModal.booking?.user?.name}</strong> for{' '}
            <strong>{actionModal.booking?.equipment?.name}</strong> as{' '}
            <strong>{actionModal.targetStatus}</strong>.
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-notes">
              {actionModal.targetStatus === 'Rejected' ? 'Reason for Rejection' : 'Administrator Remarks / Return Notes'}
            </label>
            <textarea
              id="admin-notes"
              name="adminNotes"
              rows="3"
              className="form-textarea"
              placeholder={actionModal.targetStatus === 'Rejected' ? 'e.g. Laboratory unavailable due to maintenance session...' : 'Equipment verified in good condition...'}
              value={actionModal.adminNotes}
              onChange={(e) => setActionModal((prev) => ({ ...prev, adminNotes: e.target.value }))}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setActionModal((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn ${actionModal.targetStatus === 'Rejected' ? 'btn--danger' : 'btn--primary'}`}
              disabled={actionModal.loading}
              id="confirm-action-submit"
            >
              {actionModal.loading ? 'Updating...' : `Confirm ${actionModal.targetStatus}`}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminBookings;
