import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchAllUsers, submitUpdateUserRole } from '../services/userService';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  const loadUsers = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchAllUsers(controller.signal);
      setUsers(data);
    } catch (err) {
      if (axios.isCancel(err)) return;
      console.error('Failed to load users:', err);
      const msg = err.response?.data?.detail || 'Unable to load users. Please try again later.';
      setError(msg);
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, []);

  const changeRole = async (id, newRole) => {
    setSubmitting(true);
    try {
      await submitUpdateUserRole(id, newRole);
      toast.success('User role updated successfully!');
      await loadUsers();
      return true;
    } catch (err) {
      console.error('Failed to update user role:', err);
      const msg = err.response?.data?.detail || 'Failed to update user role.';
      toast.error(msg);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadUsers]);

  return {
    users,
    loading,
    submitting,
    error,
    refresh: loadUsers,
    changeRole,
  };
};
