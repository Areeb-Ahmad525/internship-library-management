import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchAllMembers,
  submitCreateMember,
  submitUpdateMember,
  submitDeleteMember,
} from '../services/memberService';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const useMembers = (fetchOnMount = true) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(fetchOnMount);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  const loadMembers = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchAllMembers(controller.signal);
      setMembers(data);
    } catch (err) {
      if (axios.isCancel(err)) return;
      console.error('Failed to load members:', err);
      const msg = err.response?.data?.detail || 'Unable to load members. Please try again later.';
      setError(msg);
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, []);

  const create = async (payload) => {
    setSubmitting(true);
    try {
      await submitCreateMember(payload);
      toast.success('Member created successfully!');
      await loadMembers();
      return true;
    } catch (err) {
      console.error('Failed to create member:', err);
      let msg = 'Failed to create member. Please check input.';
      if (err.response?.status === 409) msg = 'A member with this email already exists.';
      else if (err.response?.data?.detail) msg = err.response.data.detail;

      // Handle FastAPI validation errors (422) arrays
      if (Array.isArray(msg)) msg = msg.map((e) => `${e.loc.join('.')}: ${e.msg}`).join(', ');

      toast.error(msg);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const update = async (id, payload) => {
    setSubmitting(true);
    try {
      await submitUpdateMember(id, payload);
      toast.success('Member updated successfully!');
      await loadMembers();
      return true;
    } catch (err) {
      console.error('Failed to update member:', err);
      let msg = 'Failed to update member.';
      if (err.response?.status === 409) msg = 'A member with this email already exists.';
      else if (err.response?.data?.detail) msg = err.response.data.detail;

      if (Array.isArray(msg)) msg = msg.map((e) => `${e.loc.join('.')}: ${e.msg}`).join(', ');

      toast.error(msg);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    setSubmitting(true);
    try {
      await submitDeleteMember(id);
      toast.success('Member deleted successfully!');
      await loadMembers();
      return true;
    } catch (err) {
      console.error('Failed to delete member:', err);
      const msg = err.response?.data?.detail || 'Failed to delete member.';
      toast.error(msg);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (fetchOnMount) {
      loadMembers();
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadMembers, fetchOnMount]);

  return {
    members,
    loading,
    submitting,
    error,
    refresh: loadMembers,
    create,
    update,
    remove,
  };
};
