import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { getToken, setToken, removeToken } from '../utils/storage';
import { authEvents } from '../utils/authEvents';
import { loginApi } from '../api/auth';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    removeToken();
    setTokenState(null);
    setUser(null);
    setRole(null);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      toast.error('Session expired. Please log in again.');
    };

    const handleForbidden = () => {
      navigate('/access-denied');
    };

    authEvents.onUnauthorized(handleUnauthorized);
    authEvents.onForbidden(handleForbidden);

    return () => {
      authEvents.offUnauthorized(handleUnauthorized);
      authEvents.offForbidden(handleForbidden);
    };
  }, [logout, navigate]);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = getToken();
        if (!storedToken) return;

        const decoded = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;

        if (!decoded.exp || decoded.exp < currentTime) {
          throw new Error('Token is missing exp or is expired');
        }

        if (!decoded.sub || !decoded.role) {
          throw new Error('Invalid token claims');
        }

        setTokenState(storedToken);
        setUser(decoded.sub);
        setRole(decoded.role);
      } catch (error) {
        console.error('Failed to restore session:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [logout]);

  const login = async (credentials) => {
    try {
      const data = await loginApi(credentials);
      const accessToken = data.access_token;

      const decoded = jwtDecode(accessToken);
      if (!decoded.sub || !decoded.role) {
        throw new Error('Invalid token claims received from server.');
      }

      setToken(accessToken);
      setTokenState(accessToken);
      setUser(decoded.sub);
      setRole(decoded.role);

      toast.success('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid credentials');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
