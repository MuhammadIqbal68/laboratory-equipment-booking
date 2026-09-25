import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboard } from '../api/services';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import StatusBadge from '../components/common/StatusBadge';
import { formatDate, formatTime } from '../utils/helpers';
import {
  HiOutlineBeaker,
  HiOutlineClipboardList,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
} from 'react-icons/hi';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getAdminDashboard();
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load administrator dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="page-container"><Loader text="Loading administrator dashboard..." /></div>;

  const stats = data?.stats || {};
  const recentBookings = data?.recentBookings || [];

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>Administrator Console</h1>
          <p>Manage laboratory inventory, supervise equipment maintenance, and review requests</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/admin/equipment" className="btn btn--secondary" id="admin-manage-eq">
            <HiOutlineBeaker size={18} /> Manage Equipment
          </Link>
          <Link to="/admin/bookings" className="btn btn--primary" id="admin-manage-bookings">
            <HiOutlineClipboardList size={18} /> Manage Bookings
          </Link>
        </div>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {/* Metrics Grid */}
      <div className="content-grid content-grid--4 mb-xl">
        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--orange">
            <HiOutlineBeaker />
          </div>
          <div className="stats-card__info">
            <h3>{stats.totalEquipment || 0}</h3>
            <p>Total Equipment</p>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--yellow">
            <HiOutlineClock />
          </div>
          <div className="stats-card__info">
            <h3>{stats.pendingBookings || 0}</h3>
            <p>Pending Requests</p>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--green">
            <HiOutlineCheckCircle />
          </div>
          <div className="stats-card__info">
            <h3>{stats.approvedBookings || 0}</h3>
            <p>Approved Bookings</p>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--blue">
            <HiOutlineUserGroup />
          </div>
          <div className="stats-card__info">
            <h3>{stats.totalStudents || 0}</h3>
            <p>Registered Students</p>
          </div>
        </div>
      </div>

      {/* Quick Action Alerts */}
      {stats.pendingBookings > 0 && (
        <div className="alert alert--warning mb-lg" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>Action Required:</strong> You have {stats.pendingBookings} pending student booking request(s) awaiting approval.
          </div>
          <Link to="/admin/bookings?status=Pending" className="btn btn--primary btn--sm">
            Review Now
          </Link>
        </div>
      )}

      {/* Recent Student Bookings */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Recent Booking Submissions</h3>
          <Link to="/admin/bookings" className="btn btn--ghost btn--sm">
            View All Submissions <HiOutlineArrowRight />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px' }}>
            <div className="empty-state__icon">📝</div>
            <div className="empty-state__title">No bookings submitted yet</div>
            <div className="empty-state__desc">Booking requests from students will appear here for review.</div>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Student ID</th>
                  <th>Equipment</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b._id}>
                    <td style={{ fontWeight: 600 }}>{b.user?.name || 'Unknown'}</td>
                    <td>{b.user?.studentId || 'N/A'}</td>
                    <td>{b.equipment?.name || 'Unknown'}</td>
                    <td>{formatDate(b.date)}</td>
                    <td>{formatTime(b.startTime)} - {formatTime(b.endTime)}</td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
