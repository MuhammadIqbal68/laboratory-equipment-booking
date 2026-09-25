import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api/services';
import Alert from '../components/common/Alert';
import { HiOutlineBeaker, HiOutlineShieldCheck, HiOutlineAcademicCap } from 'react-icons/hi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    role: 'student',
    password: '',
    confirmPassword: '',
  });
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

  const handleRoleSelect = (selectedRole) => {
    setFormData({
      ...formData,
      role: selectedRole,
      studentId: selectedRole === 'admin' && !formData.studentId ? 'ADMIN002' : formData.studentId,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...data } = formData;
      const res = await registerUser(data);
      login(res.data.data);
      navigate(res.data.data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <h1>Create Account</h1>
          <p>Register as a Student or Laboratory Administrator</p>
        </div>

        {/* Account Role Selector */}
        <div style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ marginBottom: '8px' }}>Select Account Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              className={`btn ${formData.role === 'student' ? 'btn--primary' : 'btn--secondary'}`}
              onClick={() => handleRoleSelect('student')}
              style={{ padding: '10px' }}
            >
              <HiOutlineAcademicCap size={18} /> Student
            </button>
            <button
              type="button"
              className={`btn ${formData.role === 'admin' ? 'btn--primary' : 'btn--secondary'}`}
              onClick={() => handleRoleSelect('admin')}
              style={{ padding: '10px' }}
            >
              <HiOutlineShieldCheck size={18} /> Administrator
            </button>
          </div>
        </div>

        <Alert type="error" message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder={formData.role === 'admin' ? 'Prof. Sarah Jenkins' : 'John Doe'}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <input
              type="email"
              id="reg-email"
              name="email"
              className="form-input"
              placeholder={formData.role === 'admin' ? 'admin@lab.com' : 'student@university.ac.za'}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="studentId">
              {formData.role === 'admin' ? 'Admin / Staff Identification Code' : 'Student ID Number'}
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              className="form-input"
              placeholder={formData.role === 'admin' ? 'ADMIN002' : 'STU2024001'}
              value={formData.studentId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <input
              type="password"
              id="reg-password"
              name="password"
              className="form-input"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full btn--lg"
            disabled={loading}
            id="register-submit"
          >
            {loading ? 'Creating Account...' : `Create ${formData.role === 'admin' ? 'Administrator' : 'Student'} Account`}
          </button>
        </form>

        <div className="auth-card__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
