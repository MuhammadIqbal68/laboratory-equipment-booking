import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineBeaker,
  HiOutlineCalendar,
  HiOutlineShieldCheck,
  HiOutlineClipboardList,
  HiOutlineSearch,
  HiOutlineUserGroup,
  HiOutlineArrowRight,
} from 'react-icons/hi';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
    return null;
  }

  const features = [
    {
      icon: HiOutlineSearch,
      title: 'Equipment Catalog',
      description: 'Search and explore available laboratory equipment across all departments with real-time quantities.',
    },
    {
      icon: HiOutlineCalendar,
      title: 'Conflict-Free Booking',
      description: 'Select your preferred date, time slot, and specify your academic experiment or research purpose.',
    },
    {
      icon: HiOutlineClipboardList,
      title: 'Student Tracking',
      description: 'Monitor the status of your booking requests from pending to approved in real-time.',
    },
    {
      icon: HiOutlineShieldCheck,
      title: 'Admin Equipment Control',
      description: 'Full CRUD management: add, edit, track condition (Good/Fair/Maintenance), and manage quantities.',
    },
    {
      icon: HiOutlineBeaker,
      title: 'Admin Booking Approvals',
      description: 'Supervise requests with instant 1-click approval or rejection with customized academic feedback.',
    },
    {
      icon: HiOutlineUserGroup,
      title: 'Role-Based Dashboards',
      description: 'Dedicated interfaces and metrics tailored specifically for students and laboratory administrators.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <h1 className="animate-in">Laboratory Equipment Booking System</h1>
          <p className="animate-in" style={{ animationDelay: '0.1s' }}>
            A centralized digital platform for university laboratories. Students can explore and request equipment,
            while laboratory administrators oversee inventory and manage bookings.
          </p>
          <div className="hero__actions animate-in" style={{ animationDelay: '0.2s', gap: '12px' }}>
            <Link
              to="/login"
              className="btn btn--primary btn--lg"
              id="hero-student-portal"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              🎓 Student Portal
            </Link>
            <Link
              to="/login"
              className="btn btn--secondary btn--lg"
              id="hero-admin-portal"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.2)' }}
            >
              <HiOutlineShieldCheck size={20} /> Administrator Section
            </Link>
          </div>
        </div>
      </section>

      {/* Direct Portal Quick Selector Cards */}
      <div style={{ maxWidth: '1000px', margin: '-40px auto 40px', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <div className="content-grid content-grid--2">
          {/* Student Card */}
          <Link
            to="/login"
            className="card card--clickable"
            style={{ borderTop: '4px solid var(--primary-400)', textDecoration: 'none', color: 'inherit', display: 'block' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '2rem' }}>🎓</span>
              <div>
                <h3 style={{ margin: 0 }}>Student Section</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>For students & researchers</span>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', marginBottom: '16px' }}>
              Browse scientific equipment, check live availability, submit booking requests with purpose notes, and track your active sessions.
            </p>
            <div style={{ color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Sign In to Student Dashboard <HiOutlineArrowRight />
            </div>
          </Link>

          {/* Admin Card */}
          <Link
            to="/login"
            className="card card--clickable"
            style={{ borderTop: '4px solid #EA580C', textDecoration: 'none', color: 'inherit', display: 'block' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '2rem' }}>🛡️</span>
              <div>
                <h3 style={{ margin: 0 }}>Administrator Section</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>For lab managers & technicians</span>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', marginBottom: '16px' }}>
              Manage laboratory equipment inventory (add/edit/delete), review pending student requests, approve/reject bookings, and monitor lab usage.
            </p>
            <div style={{ color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Sign In to Administrator Console <HiOutlineArrowRight />
            </div>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <section className="features">
        <h2>Complete System Features</h2>
        <div className="content-grid content-grid--3">
          {features.map((feature, index) => (
            <div key={index} className="card feature-card animate-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="feature-card__icon">
                <feature.icon size={28} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: 'var(--space-xl)',
        borderTop: '1px solid var(--border-light)',
        color: 'var(--text-tertiary)',
        fontSize: '0.875rem',
      }}>
        <p>© 2026 LabBook — Laboratory Equipment Booking System</p>
      </footer>
    </div>
  );
};

export default Home;
