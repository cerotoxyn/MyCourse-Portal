import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  if (currentUser) {
    return (
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card soft-card">
            <div className="card-body p-4 text-center">
              <h2 className="page-title">You are already logged in</h2>
              <p className="text-secondary">Welcome back, {currentUser.name}.</p>
              <Link to="/courses" className="btn btn-primary">
                Go to Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setCurrentUser(data);
      navigate(data.role === 'teacher' ? '/teacher' : '/schedule');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <div className="card soft-card">
          <div className="card-body p-4 p-lg-5">
            <h2 className="page-title mb-3">Login</h2>
            <p className="text-secondary">
              Demo teacher: <strong>teacher@portal.edu</strong> / <strong>pass123</strong>
              <br />
              Demo student: <strong>student@portal.edu</strong> / <strong>pass123</strong>
            </p>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;