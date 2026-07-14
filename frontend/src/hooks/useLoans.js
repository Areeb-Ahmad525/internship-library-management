import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchAllLoans,
  fetchActiveLoans,
  fetchMemberLoans,
  fetchBookLoans,
  submitBorrow,
  submitReturn,
  deleteLoan,
} from '../services/loanService';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const useLoans = (fetchOnMount = true) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(fetchOnMount);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  const loadLoans = useCallback(async (filter = 'ALL') => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      let data;
      if (filter === 'ACTIVE') {
        data = await fetchActiveLoans(controller.signal);
      } else {
        data = await fetchAllLoans(controller.signal);
      }
      setLoans(data);
    } catch (err) {
      if (axios.isCancel(err)) return;
      console.error('Failed to load loans:', err);
      // Friendly message (don't expose backend stack)
      const msg = err.response?.data?.detail || 'Unable to load loans. Please try again later.';
      setError(msg);
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, []);

  const borrow = async (payload) => {
    setSubmitting(true);
    try {
      await submitBorrow(payload);
      toast.success('Book borrowed successfully!');
      return true; // Indicate success
    } catch (err) {
      console.error('Failed to borrow book:', err);
      const msg = err.response?.data?.detail || 'Failed to borrow book. Please check availability.';
      toast.error(msg);
      return false; // Indicate failure
    } finally {
      setSubmitting(false);
    }
  };

  const returnLoan = async (loanId) => {
    setSubmitting(true);
    try {
      await submitReturn(loanId);
      toast.success('Book returned successfully!');
      await loadLoans(); // Automatically refresh on return success
      return true;
    } catch (err) {
      console.error('Failed to return book:', err);
      const msg = err.response?.data?.detail || 'Failed to return book. Please try again.';
      toast.error(msg);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (fetchOnMount) {
      loadLoans();
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadLoans, fetchOnMount]);

  const remove = async (loanId) => {
    setSubmitting(true);
    try {
      await deleteLoan(loanId);
      loadLoans();
      return true;
    } catch (err) {
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loans,
    loading,
    error,
    submitting,
    refresh: loadLoans,
    borrow,
    returnLoan,
    remove,
  };
};
