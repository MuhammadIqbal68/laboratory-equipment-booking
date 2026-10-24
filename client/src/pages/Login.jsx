import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/services';
import Alert from '../components/common/Alert';
import { HiOutlineBeaker } from 'react-icons/hi';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await loginUser(formData);
      login(res.data.data);
      navigate(res.data.data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-in">
        <div className="auth-card__logo">
          <div className="auth-card__logo-icon">
            <HiOutlineBeaker />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your LabBook account</p>
        </div>

        <Alert type="error" message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="you@university.ac.za"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full btn--lg"
            disabled={loading}
            id="login-submit"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ background: 'var(--gray-50)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '0.8rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Registered Accounts for Testing:</span>
            <div style={{ marginTop: '6px', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
              <div>🛡️ <strong>Administrator:</strong> <code>admin@lab.com</code> (Password: <code>admin123</code>)</div>
              <div style={{ marginTop: '3px' }}>🎓 <strong>Student:</strong> <code>student@university.ac.za</code> (Password: <code>student123</code>)</div>
            </div>
          </div>
        </div>

        <div className="auth-card__footer">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
