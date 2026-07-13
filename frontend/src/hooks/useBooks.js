import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchAllBooks,
  findBooks,
  createBook,
  updateBook,
  deleteBook,
} from '../services/bookService';
import axios from 'axios'; // Only for checking isCancel

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Keep track of the current request to allow cancellation
  const abortControllerRef = useRef(null);

  const loadBooks = useCallback(async (searchQuery = '') => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      let data;
      if (searchQuery.trim()) {
        data = await findBooks(searchQuery, controller.signal);
      } else {
        data = await fetchAllBooks(controller.signal);
      }
      setBooks(data);
    } catch (err) {
      // If it's a cancellation error, we just ignore it
      if (axios.isCancel(err)) {
        return;
      }
      console.error('Failed to load books:', err);
      setError('Unable to load books. Please try again later.');
    } finally {
      // Only toggle loading off if this is still the active request
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBooks();

    return () => {
      // Cleanup on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadBooks]);

  const create = async (payload) => {
    setSubmitting(true);
    try {
      await createBook(payload);
      loadBooks();
      return true;
    } catch (err) {
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const update = async (id, payload) => {
    setSubmitting(true);
    try {
      await updateBook(id, payload);
      loadBooks();
      return true;
    } catch (err) {
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    setSubmitting(true);
    try {
      await deleteBook(id);
      loadBooks();
      return true;
    } catch (err) {
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    books,
    loading,
    error,
    submitting,
    refresh: loadBooks,
    search: loadBooks,
    create,
    update,
    remove,
  };
};
