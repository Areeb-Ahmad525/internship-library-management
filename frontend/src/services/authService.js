import { registerApi } from '../api/auth';
import { toast } from 'react-hot-toast';

export const register = async (userData) => {
  try {
    const newUser = await registerApi(userData);
    toast.success('Registration successful! Please log in.');
    return newUser;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      toast.error(error.response.data.detail || 'Username or email already exists.');
    } else if (error.response && error.response.data && error.response.data.detail) {
      // In case of Pydantic validation errors, detail is an array
      const detail = error.response.data.detail;
      if (Array.isArray(detail)) {
        toast.error(detail[0].msg || 'Validation error');
      } else {
        toast.error(detail);
      }
    } else {
      toast.error('Registration failed. Please try again.');
    }
    throw error;
  }
};
