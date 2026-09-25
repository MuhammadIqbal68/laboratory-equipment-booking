import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEquipment } from '../api/services';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import { CATEGORIES, getCategoryIcon } from '../utils/helpers';
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineFilter } from 'react-icons/hi';

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters & Search
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [available, setAvailable] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (category) params.category = category;
      if (condition) params.condition = condition;
      if (available) params.available = available;

      const res = await getEquipment(params);
      setEquipment(res.data.data);
      setTotalPages(res.data.pagination.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load equipment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, [page, category, condition, available]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEquipment();
  };

  const handleReset = () => {
    setSearch('');
    setCategory('');
    setCondition('');
    setAvailable('');
    setPage(1);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Laboratory Equipment</h1>
        <p>Explore and book equipment available across university laboratories</p>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {/* Filter and Search Bar */}
      <div className="card mb-lg">
        <form onSubmit={handleSearchSubmit} className="filter-bar" style={{ marginBottom: 0 }}>
          <div style={{ flex: 1, minWidth: '220px', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search equipment name or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="search-input"
            />
            <button type="submit" className="btn btn--primary" id="search-submit">
              <HiOutlineSearch size={18} /> Search
            </button>
          </div>

          <select
            className="form-select"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            id="filter-category"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            className="form-select"
            value={available}
            onChange={(e) => { setAvailable(e.target.value); setPage(1); }}
            id="filter-availability"
          >
            <option value="">All Statuses</option>
            <option value="true">Available Now</option>
            <option value="false">Unavailable</option>
          </select>

          {(search || category || condition || available) && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleReset}
              id="reset-filters"
            >
              Clear Filters
            </button>
          )}
        </form>
      </div>

      {/* Content */}
      {loading ? (
        <Loader text="Loading equipment catalog..." />
      ) : equipment.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state__icon">🔍</div>
          <div className="empty-state__title">No equipment found</div>
          <div className="empty-state__desc">
            Try adjusting your search query or removing filters to see available equipment.
          </div>
          {(search || category || condition || available) && (
            <button className="btn btn--secondary" onClick={handleReset}>
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="content-grid content-grid--3">
            {equipment.map((item) => (
              <Link
                to={`/equipment/${item._id}`}
                key={item._id}
                className="equipment-card"
                id={`equipment-card-${item._id}`}
              >
                <div className="equipment-card__image">
                  <span>{getCategoryIcon(item.category)}</span>
                  <span className="equipment-card__category">{item.category}</span>
                </div>
                <div className="equipment-card__body">
                  <div className="equipment-card__name">{item.name}</div>
                  <div className="equipment-card__desc">{item.description}</div>
                  <div className="equipment-card__meta">
                    <div className="equipment-card__location">
                      <HiOutlineLocationMarker size={16} />
                      <span>{item.laboratory}</span>
                    </div>
                    <div
                      className={`equipment-card__availability ${
                        item.isAvailable && item.availableQuantity > 0
                          ? 'equipment-card__availability--available'
                          : 'equipment-card__availability--unavailable'
                      }`}
                    >
                      {item.isAvailable && item.availableQuantity > 0
                        ? `${item.availableQuantity} Available`
                        : 'Unavailable'}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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
    </div>
  );
};

export default EquipmentList;
