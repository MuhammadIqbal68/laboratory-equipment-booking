import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEquipmentById, createBooking } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import Modal from '../components/common/Modal';
import { getCategoryIcon } from '../utils/helpers';
import {
  HiOutlineLocationMarker,
  HiOutlineCube,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineArrowLeft,
} from 'react-icons/hi';

const EquipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    startTime: '09:00',
    endTime: '11:00',
    quantity: 1,
    purpose: '',
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await getEquipmentById(id);
        setEquipment(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch equipment details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setBookingError('');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (formData.startTime >= formData.endTime) {
      setBookingError('End time must be after start time.');
      return;
    }

    setBookingLoading(true);
    setBookingError('');

    try {
      await createBooking({
        equipment: id,
        ...formData,
        quantity: Number(formData.quantity),
      });
      setIsModalOpen(false);
      setBookingSuccess('Booking request submitted successfully! Awaiting administrator approval.');
      // Refresh equipment to reflect updated availability
      const updated = await getEquipmentById(id);
      setEquipment(updated.data.data);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Booking conflict or request error occurred.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="page-container"><Loader text="Loading equipment details..." /></div>;
  if (error || !equipment) {
    return (
      <div className="page-container">
        <Alert type="error" message={error || 'Equipment not found'} />
        <button className="btn btn--secondary" onClick={() => navigate('/equipment')}>
          <HiOutlineArrowLeft /> Back to Equipment
        </button>
      </div>
    );
  }

  const isAvailable = equipment.isAvailable && equipment.availableQuantity > 0;

  return (
    <div className="page-container">
      <button className="btn btn--ghost mb-md" onClick={() => navigate('/equipment')}>
        <HiOutlineArrowLeft /> Back to Equipment Catalog
      </button>

      <Alert type="success" message={bookingSuccess} onClose={() => setBookingSuccess('')} />

      <div className="card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          {/* Visual Banner */}
          <div
            style={{
              width: '280px',
              height: '240px',
              background: 'linear-gradient(135deg, var(--primary-100), var(--primary-50))',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4.5rem',
            }}
          >
            <span>{getCategoryIcon(equipment.category)}</span>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                marginTop: '12px',
                color: 'var(--primary-700)',
                background: 'white',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--primary-200)',
              }}
            >
              {equipment.category}
            </span>
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2>{equipment.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <HiOutlineLocationMarker size={18} />
                  <span>{equipment.laboratory}</span>
                </div>
              </div>
              <div>
                {isAvailable ? (
                  <span className="badge badge--approved" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                    <HiOutlineCheckCircle size={16} /> Available
                  </span>
                ) : (
                  <span className="badge badge--rejected" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                    <HiOutlineXCircle size={16} /> Unavailable
                  </span>
                )}
              </div>
            </div>

            <hr style={{ margin: '20px 0', borderColor: 'var(--border-light)' }} />

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '8px' }}>Description</h4>
              <p>{equipment.description}</p>
            </div>

            {/* Quick Specs Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '16px',
                marginBottom: '28px',
              }}
            >
              <div style={{ background: 'var(--gray-50)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Total Quantity</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px' }}>{equipment.totalQuantity} Units</div>
              </div>

              <div style={{ background: 'var(--gray-50)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Available Quantity</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px', color: isAvailable ? 'var(--status-approved)' : 'var(--status-rejected)' }}>
                  {equipment.availableQuantity} Units
                </div>
              </div>

              <div style={{ background: 'var(--gray-50)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Condition</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px' }}>{equipment.condition}</div>
              </div>
            </div>

            {/* Book Action */}
            {user?.role === 'admin' ? (
              <div className="alert alert--info">
                You are logged in as an administrator. Navigate to the Admin Panel to manage this equipment.
              </div>
            ) : (
              <button
                className="btn btn--primary btn--lg"
                disabled={!isAvailable}
                onClick={() => setIsModalOpen(true)}
                id="open-booking-modal"
              >
                <HiOutlineCube size={20} />
                {isAvailable ? 'Request / Book Equipment' : 'Equipment Currently Unavailable'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Book ${equipment.name}`}
      >
        <Alert type="error" message={bookingError} onClose={() => setBookingError('')} />

        <form onSubmit={handleBookingSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="book-date">Required Date</label>
            <input
              type="date"
              id="book-date"
              name="date"
              className="form-input"
              min={new Date().toISOString().split('T')[0]}
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="book-startTime">Start Time</label>
              <input
                type="time"
                id="book-startTime"
                name="startTime"
                className="form-input"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="book-endTime">End Time</label>
              <input
                type="time"
                id="book-endTime"
                name="endTime"
                className="form-input"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="book-quantity">Quantity Needed (Max: {equipment.availableQuantity})</label>
            <input
              type="number"
              id="book-quantity"
              name="quantity"
              min="1"
              max={equipment.availableQuantity}
              className="form-input"
              value={formData.quantity}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="book-purpose">Academic Purpose / Research Activity</label>
            <textarea
              id="book-purpose"
              name="purpose"
              rows="3"
              className="form-textarea"
              placeholder="Explain the practical experiment or project requirement..."
              value={formData.purpose}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={bookingLoading}
              id="submit-booking-request"
            >
              {bookingLoading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EquipmentDetails;
