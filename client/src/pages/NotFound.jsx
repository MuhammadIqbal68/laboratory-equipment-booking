import { Link } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';

const NotFound = () => {
  return (
    <div className="page-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
      <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary-500)', lineHeight: 1 }}>
        404
      </div>
      <h2 style={{ marginTop: '16px', marginBottom: '8px' }}>Page Not Found</h2>
      <p style={{ maxWidth: '400px', margin: '0 auto 24px' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn--primary">
        <HiOutlineArrowLeft /> Return Home
      </Link>
    </div>
  );
};

export default NotFound;
