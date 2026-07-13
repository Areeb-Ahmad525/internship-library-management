import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '1rem' }}>
      <h1>Login</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <button type="submit" disabled={isLoading} style={{ padding: '0.5rem' }}>
          {isLoading ? 'Logging in...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
