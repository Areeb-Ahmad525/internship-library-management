import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ username, password });

      const from = location.state?.from?.pathname || '/';
      // Prevent redirecting back to login
      const destination = from === '/login' ? '/' : from;

      navigate(destination, { replace: true });
    } catch {
      // toast is already handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <main>
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
          >
            {isLoading ? 'Logging in...' : 'Submit'}
          </button>
        </form>
        <p
          style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
          }}
        >
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </main>
    </div>
  );
};

export default LoginPage;
