import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineBeaker,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineLogout,
  HiOutlineViewGrid,
  HiOutlineClipboardList,
  HiOutlineShieldCheck,
} from 'react-icons/hi';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Brand */}
        <Link to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : '/'} className="navbar__brand">
          <div className="navbar__brand-icon">
            <HiOutlineBeaker />
          </div>
          <span>LabBook</span>
        </Link>

        {/* Authenticated Nav */}
        {isAuthenticated && (
          <>
            <button
              className="navbar__mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              id="mobile-menu-toggle"
            >
              {mobileOpen ? <HiOutlineX /> : <HiOutlineMenu />}
            </button>

            <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
              {user?.role === 'admin' ? (
                <>
                  <Link
                    to="/admin"
                    className={`navbar__link ${isActive('/admin') ? 'navbar__link--active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                    id="nav-admin-dashboard"
                  >
                    <HiOutlineViewGrid size={18} />
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/admin/equipment"
                    className={`navbar__link ${isActive('/admin/equipment') ? 'navbar__link--active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                    id="nav-admin-equipment"
                  >
                    <HiOutlineBeaker size={18} />
                    Equipment Inventory
                  </Link>
                  <Link
                    to="/admin/bookings"
                    className={`navbar__link ${isActive('/admin/bookings') ? 'navbar__link--active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                    id="nav-admin-bookings"
                  >
                    <HiOutlineClipboardList size={18} />
                    Manage Bookings
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className={`navbar__link ${isActive('/dashboard') ? 'navbar__link--active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                    id="nav-student-dashboard"
                  >
                    <HiOutlineViewGrid size={18} />
                    Dashboard
                  </Link>
                  <Link
                    to="/equipment"
                    className={`navbar__link ${isActive('/equipment') ? 'navbar__link--active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                    id="nav-equipment"
                  >
                    <HiOutlineBeaker size={18} />
                    Equipment Catalog
                  </Link>
                  <Link
                    to="/my-bookings"
                    className={`navbar__link ${isActive('/my-bookings') ? 'navbar__link--active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                    id="nav-my-bookings"
                  >
                    <HiOutlineClipboardList size={18} />
                    My Bookings
                  </Link>
                </>
              )}

              <button className="navbar__link" onClick={handleLogout} id="nav-logout">
                <HiOutlineLogout size={18} />
                Logout
              </button>
            </div>

            <div className="navbar__user">
              <div className="navbar__user-info">
                <div className="navbar__user-name">{user?.name}</div>
                <div className="navbar__user-role" style={{ color: user?.role === 'admin' ? 'var(--primary-600)' : 'var(--text-tertiary)', fontWeight: user?.role === 'admin' ? 700 : 500 }}>
                  {user?.role === 'admin' ? '🛡️ Administrator' : '🎓 Student'}
                </div>
              </div>
              <div
                className="navbar__avatar"
                style={{
                  background: user?.role === 'admin' ? 'linear-gradient(135deg, #EA580C, #9A3412)' : undefined,
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            </div>
          </>
        )}

        {/* Public Visitor Nav */}
        {!isAuthenticated && (
          <div className="navbar__links">
            <Link to="/login" className="navbar__link" id="nav-login">Sign In</Link>
            <Link to="/login" className="btn btn--secondary btn--sm" style={{ marginRight: '6px' }}>
              <HiOutlineShieldCheck size={16} /> Admin Section
            </Link>
            <Link to="/register" className="btn btn--primary btn--sm" id="nav-register">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
