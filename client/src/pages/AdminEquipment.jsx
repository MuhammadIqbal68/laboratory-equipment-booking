import { useState, useEffect } from 'react';
import {
  getEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from '../api/services';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import Modal from '../components/common/Modal';
import { CATEGORIES, CONDITIONS } from '../utils/helpers';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineEye,
} from 'react-icons/hi';

const AdminEquipment = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search & Filter
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [available, setAvailable] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // View Details Modal
  const [viewingItem, setViewingItem] = useState(null);

  // Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Chemistry',
    totalQuantity: 1,
    availableQuantity: 1,
    laboratory: '',
    condition: 'Good',
    isAvailable: true,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete Confirmation Modal
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (category) params.category = category;
      if (condition) params.condition = condition;
      if (available) params.available = available;
      const res = await getEquipment(params);
      setEquipmentList(res.data.data);
      setTotalPages(res.data.pagination.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load equipment catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, [page, category, condition, available]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      category: 'Chemistry',
      totalQuantity: 1,
      availableQuantity: 1,
      laboratory: '',
      condition: 'Good',
      isAvailable: true,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      totalQuantity: item.totalQuantity,
      availableQuantity: item.availableQuantity,
      laboratory: item.laboratory,
      condition: item.condition,
      isAvailable: item.isAvailable,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      const payload = {
        ...formData,
        totalQuantity: Number(formData.totalQuantity),
        availableQuantity: Number(formData.availableQuantity),
      };

      if (editingItem) {
        await updateEquipment(editingItem._id, payload);
        setSuccess('Equipment details updated successfully');
      } else {
        await createEquipment(payload);
        setSuccess('New equipment added to the inventory');
      }

      setIsModalOpen(false);
      fetchEquipment();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save equipment');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    try {
      setDeleteLoading(true);
      await deleteEquipment(deletingItem._id);
      setSuccess(`Equipment '${deletingItem.name}' removed`);
      setDeletingItem(null);
      fetchEquipment();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete equipment');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>Laboratory Equipment Inventory</h1>
          <p>Add, modify, and track physical equipment in your university labs</p>
        </div>
        <button className="btn btn--primary" onClick={handleOpenAdd} id="admin-add-equipment-btn">
          <HiOutlinePlus size={18} /> Add New Equipment
        </button>
      </div>

      <Alert type="success" message={success} onClose={() => setSuccess('')} />
      <Alert type="error" message={error} onClose={() => setError('')} />

      {/* Filters */}
      <div className="card mb-lg" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '220px', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by equipment name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn--primary" onClick={() => { setPage(1); fetchEquipment(); }}>
              <HiOutlineSearch size={18} />
            </button>
          </div>

          <select
            className="form-select"
            style={{ width: '180px' }}
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            className="form-select"
            style={{ width: '170px' }}
            value={condition}
            onChange={(e) => { setCondition(e.target.value); setPage(1); }}
          >
            <option value="">All Conditions</option>
            {CONDITIONS.map((cond) => (
              <option key={cond} value={cond}>{cond}</option>
            ))}
          </select>

          <select
            className="form-select"
            style={{ width: '160px' }}
            value={available}
            onChange={(e) => { setAvailable(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>

          {(search || category || condition || available) && (
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => {
                setSearch('');
                setCategory('');
                setCondition('');
                setAvailable('');
                setPage(1);
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <Loader text="Loading equipment..." />
      ) : equipmentList.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state__icon">📦</div>
          <div className="empty-state__title">No equipment records</div>
          <div className="empty-state__desc">Get started by creating your first laboratory equipment item.</div>
          <button className="btn btn--primary mt-sm" onClick={handleOpenAdd}>
            Add Equipment
          </button>
        </div>
      ) : (
        <>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Equipment Name</th>
                <th>Category</th>
                <th>Lab / Location</th>
                <th>Condition</th>
                <th>Total</th>
                <th>Available</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipmentList.map((item) => (
                <tr key={item._id}>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.laboratory}</td>
                  <td>{item.condition}</td>
                  <td>{item.totalQuantity}</td>
                  <td style={{ fontWeight: 600, color: item.availableQuantity > 0 ? 'var(--status-approved)' : 'var(--status-rejected)' }}>
                    {item.availableQuantity}
                  </td>
                  <td>
                    {item.isAvailable && item.availableQuantity > 0 ? (
                      <span className="badge badge--approved">Available</span>
                    ) : (
                      <span className="badge badge--rejected">Unavailable</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn--secondary btn--sm"
                        onClick={() => setViewingItem(item)}
                        title="View Details"
                        id={`view-eq-${item._id}`}
                      >
                        <HiOutlineEye size={16} />
                      </button>
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => handleOpenEdit(item)}
                        title="Edit Equipment"
                        id={`edit-eq-${item._id}`}
                      >
                        <HiOutlinePencil size={16} />
                      </button>
                      <button
                        className="btn btn--danger btn--sm"
                        onClick={() => setDeletingItem(item)}
                        title="Delete Equipment"
                        id={`delete-eq-${item._id}`}
                      >
                        <HiOutlineTrash size={16} />
                      </button>
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

      {/* Add / Edit Equipment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Equipment Details' : 'Add New Equipment'}
      >
        <Alert type="error" message={formError} onClose={() => setFormError('')} />

        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="eq-name">Equipment Name</label>
            <input
              type="text"
              id="eq-name"
              name="name"
              className="form-input"
              placeholder="e.g. Digital Oscilloscope 200MHz"
              value={formData.name}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="eq-desc">Description</label>
            <textarea
              id="eq-desc"
              name="description"
              className="form-textarea"
              rows="3"
              placeholder="Provide functional overview, specifications, and safety notes..."
              value={formData.description}
              onChange={handleFormChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: editingItem ? '1fr 1fr 1fr' : '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="eq-category">Category</label>
              <select
                id="eq-category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleFormChange}
                required
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="eq-qty">Total Quantity</label>
              <input
                type="number"
                id="eq-qty"
                name="totalQuantity"
                min="1"
                className="form-input"
                value={formData.totalQuantity}
                onChange={handleFormChange}
                required
              />
            </div>

            {editingItem && (
              <div className="form-group">
                <label className="form-label" htmlFor="eq-avail-qty">Available Qty</label>
                <input
                  type="number"
                  id="eq-avail-qty"
                  name="availableQuantity"
                  min="0"
                  max={formData.totalQuantity}
                  className="form-input"
                  value={formData.availableQuantity}
                  onChange={handleFormChange}
                  required
                />
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="eq-lab">Lab / Location</label>
              <input
                type="text"
                id="eq-lab"
                name="laboratory"
                className="form-input"
                placeholder="e.g. Physics Lab - Room 302"
                value={formData.laboratory}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="eq-condition">Condition</label>
              <select
                id="eq-condition"
                name="condition"
                className="form-select"
                value={formData.condition}
                onChange={handleFormChange}
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleFormChange}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary-500)' }}
            />
            <label htmlFor="isAvailable" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
              Allow students to book this equipment
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
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
              disabled={formLoading}
              id="save-equipment-submit"
            >
              {formLoading ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Equipment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        title="Delete Equipment"
        footer={
          <>
            <button className="btn btn--ghost" onClick={() => setDeletingItem(null)}>
              Cancel
            </button>
            <button
              className="btn btn--danger"
              disabled={deleteLoading}
              onClick={handleDeleteConfirm}
              id="confirm-delete-eq"
            >
              {deleteLoading ? 'Deleting...' : 'Delete Equipment'}
            </button>
          </>
        }
      >
        <p>
          Are you sure you want to permanently delete <strong>{deletingItem?.name}</strong>?
        </p>
        <p style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          This will remove the item from university records. Existing booking logs will remain unaffected.
        </p>
      </Modal>

      {/* View Equipment Details Modal */}
      <Modal
        isOpen={!!viewingItem}
        onClose={() => setViewingItem(null)}
        title={viewingItem ? viewingItem.name : 'Equipment Details'}
        footer={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn--secondary btn--sm"
              onClick={() => {
                const item = viewingItem;
                setViewingItem(null);
                handleOpenEdit(item);
              }}
            >
              <HiOutlinePencil size={14} /> Edit Equipment
            </button>
            <button className="btn btn--primary btn--sm" onClick={() => setViewingItem(null)}>
              Close
            </button>
          </div>
        }
      >
        {viewingItem && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Category</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>{viewingItem.category}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Laboratory Location</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>{viewingItem.laboratory}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Total Inventory</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>{viewingItem.totalQuantity} units</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Available Quantity</span>
                <div style={{ fontWeight: 600, marginTop: '2px', color: viewingItem.availableQuantity > 0 ? 'var(--status-approved)' : 'var(--status-rejected)' }}>
                  {viewingItem.availableQuantity} units
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Physical Condition</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>{viewingItem.condition}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Status</span>
                <div style={{ marginTop: '2px' }}>
                  {viewingItem.isAvailable && viewingItem.availableQuantity > 0 ? (
                    <span className="badge badge--approved">Available for Booking</span>
                  ) : (
                    <span className="badge badge--rejected">Unavailable</span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Description</span>
              <p style={{ marginTop: '4px', fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{viewingItem.description}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminEquipment;
