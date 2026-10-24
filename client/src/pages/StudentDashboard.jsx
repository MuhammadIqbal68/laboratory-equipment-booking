import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStudentDashboard } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import StatusBadge from '../components/common/StatusBadge';
import { formatDate, formatTime } from '../utils/helpers';
import {
  HiOutlineClipboardList,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineArrowRight,
  HiOutlineBeaker,
} from 'react-icons/hi';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await getStudentDashboard();
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="page-container"><Loader text="Loading your dashboard..." /></div>;

  const stats = data?.stats || { total: 0, pending: 0, approved: 0, rejected: 0, completed: 0 };
  const recentBookings = data?.recentBookings || [];

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>Welcome, {user?.name}!</h1>
          <p>Student ID: {user?.studentId} • Manage your lab bookings and active requests</p>
        </div>
        <Link to="/equipment" className="btn btn--primary" id="dashboard-browse-btn">
          <HiOutlineBeaker size={18} /> Browse Equipment
        </Link>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {/* Stats Cards */}
      <div className="content-grid content-grid--4 mb-xl">
        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--orange">
            <HiOutlineClipboardList />
          </div>
          <div className="stats-card__info">
            <h3>{stats.total}</h3>
            <p>Total Bookings</p>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--yellow">
            <HiOutlineClock />
          </div>
          <div className="stats-card__info">
            <h3>{stats.pending}</h3>
            <p>Pending Review</p>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--green">
            <HiOutlineCheckCircle />
          </div>
          <div className="stats-card__info">
            <h3>{stats.approved}</h3>
            <p>Approved Bookings</p>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--red">
            <HiOutlineXCircle />
          </div>
          <div className="stats-card__info">
            <h3>{stats.rejected}</h3>
            <p>Rejected Requests</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Recent Booking Activity</h3>
          <Link to="/my-bookings" className="btn btn--ghost btn--sm">
            View All Bookings <HiOutlineArrowRight />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px' }}>
            <div className="empty-state__icon">📋</div>
            <div className="empty-state__title">No bookings submitted yet</div>
            <div className="empty-state__desc">Browse the equipment inventory and submit your first booking request.</div>
            <Link to="/equipment" className="btn btn--secondary btn--sm mt-sm">Browse Catalog</Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Laboratory</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b._id}>
                    <td style={{ fontWeight: 600 }}>{b.equipment?.name || 'N/A'}</td>
                    <td>{b.equipment?.laboratory || 'N/A'}</td>
                    <td>{formatDate(b.date)}</td>
                    <td>{formatTime(b.startTime)} - {formatTime(b.endTime)}</td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                    <td>
                      <Link to="/my-bookings" className="btn btn--secondary btn--sm">
                        View <HiOutlineArrowRight size={12} />
                      </Link>
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

export default StudentDashboard;
