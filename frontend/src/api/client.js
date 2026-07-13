import axios from 'axios';
import { getToken } from '../utils/storage';
import { authEvents } from '../utils/authEvents';
import { toast } from 'react-hot-toast';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (!error.response) {
      toast.error('Network failure. Please check your connection and try again.');
    } else if (error.response.status === 401) {
      const isAuthEndpoint = error.config.url?.includes('/auth/login');
      if (!isAuthEndpoint) {
        authEvents.emitUnauthorized();
      }
    } else if (error.response.status === 403) {
      authEvents.emitForbidden();
    } else if (error.response.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    return Promise.reject(error);
  }
);

export default client;
