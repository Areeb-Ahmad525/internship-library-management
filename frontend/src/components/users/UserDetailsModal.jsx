import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { fetchUserById } from '../../services/userService';
import { toast } from 'react-hot-toast';

const UserDetailsModal = ({ isOpen, onClose, userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const loadUser = async () => {
      setLoading(true);
      try {
        const data = await fetchUserById(userId);
        setUser(data);
      } catch (err) {
        toast.error('Failed to load user details.');
        onClose();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [isOpen, userId, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>User Details</h2>

        {loading ? (
          <p>Loading user details...</p>
        ) : user ? (
          <div>
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> <span className="badge badge-default">{user.role}</span>
            </p>
            <p>
              <strong>Created:</strong> {new Date(user.created_at).toLocaleString()}
            </p>
          </div>
        ) : (
          <p>User not found.</p>
        )}

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UserDetailsModal;
